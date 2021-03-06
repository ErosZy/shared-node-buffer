#include "binding.h"

bool __fallocate(const int fd, const size_t length)
{
    const uint8_t *data = new uint8_t[length];
    memset((void *)data, 0, length);

    size_t size = 0;
#if defined(_WIN32)
    _lseek(fd, 0, SEEK_END);
    size = (size_t)_write(fd, data, length);
#else
    lseek(fd, 0, SEEK_END);
    size = (size_t)write(fd, data, length);
#endif

    delete[] data;
    return size == length;
}

void finalize(Napi::Env env, uint8_t *data, int *size)
{
#if defined(_WIN32)
    UnmapViewOfFile((void *)data);
#else
    munmap((void *)data, *size);
#endif

    delete size;
}

Napi::Value __mmap(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 3)
    {
        Napi::TypeError::New(env, "wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    const std::string filepath = info[0].As<Napi::String>().Utf8Value();
    const size_t length = info[1].As<Napi::Number>().Int64Value();
    const bool allocated = info[2].As<Napi::Boolean>().Value();

    int fd = 0;
#if defined(_WIN32)
    fd = _open(filepath.c_str(), _O_CREAT | _O_RDWR | (allocated ? _O_TRUNC : 0), 0777);
#else
    fd = open(filepath.c_str(), O_CREAT | O_RDWR | (allocated ? O_TRUNC : 0), 0777);
#endif

    if (fd == -1)
    {
        Napi::TypeError::New(env, "file open failed").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (allocated && !__fallocate(fd, length))
    {
        Napi::TypeError::New(env, "fallocate file failed").ThrowAsJavaScriptException();
        close(fd);
        return env.Null();
    }

    uint8_t *data = nullptr;
#if defined(_WIN32)
    HANDLE description = CreateFileA(
        filepath.c_str(),
        GENERIC_READ | GENERIC_WRITE,
        FILE_SHARE_READ | FILE_SHARE_WRITE,
        NULL,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        NULL);

    HANDLE mappingObject = CreateFileMapping(
        description,
        NULL,
        PAGE_READWRITE,
        0,
        0,
        NULL);

    data = (uint8_t *)MapViewOfFile(mappingObject, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, length);

    _close(fd);
    CloseHandle(description);
    CloseHandle(mappingObject);
#else
    data = (uint8_t *)mmap(0, length, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (data == MAP_FAILED)
    {
        Napi::Error::New(env, "create shared memory failed").ThrowAsJavaScriptException();
        close(fd);
        return env.Null();
    }

    close(fd);
#endif

    return Napi::Buffer<uint8_t>::New(env, data, length, finalize, new int(length));
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "mmap"), Napi::Function::New(env, __mmap));
    return exports;
}

NODE_API_MODULE(mmap, Init)