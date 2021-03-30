#if defined(_WIN32)
#include <Windows.h>
#include <io.h>
#include <fcntl.h>
#else
#include <sys/stat.h>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#endif

#include <string.h>
#include "napi.h"

bool __fallocate(const int fd, const size_t length);

Napi::Value bind(const Napi::CallbackInfo &info);

Napi::Object Init(Napi::Env env, Napi::Object exports);