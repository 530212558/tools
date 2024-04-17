// sw.js
const preCacheName = 'preCache';
const preCacheList = [
    
]

self.addEventListener('install', event => {
    
  event.waitUntil(new Promise((resolve) => {
    console.log('service worker 安装成功')
    // 模拟 promise 返回错误结果的情况
    if(preCacheList.length){
        caches.open(preCacheName).then(function (cache) {
            // console.log('SW precaching')
            cache.addAll(preCacheList)
        })
    }
    resolve()
  }))
  // 跳过等待
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  // 激活回调的逻辑处理
  console.log('service worker 激活成功')
  event.waitUntil(
    // 删除其他非install阶段预缓存的老数据
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== preCacheName) {
            return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', event => {
  console.log('service worker 抓取请求成功: ' + event.request.url)
  const requestUrl = new URL(event.request.url);
  const { pathname } = requestUrl;

  // 存储我们想要处理的文件夹路径
  const fetchCachesName = 'fetchCaches';
  const fetchCacheList = ['/js/', '/css/', '.css', '.js'];
  let shouldHandlFetchCacheList = false;
  let shouldHandlePreCacheList = false;
  if(fetchCacheList.length){
    shouldHandlFetchCacheList = fetchCacheList.some(function(path) {
        return pathname.includes(path);
    });
  }else if(!preCacheList.length){
    console.log('pathname:',pathname, 'preCacheList:', preCacheList)
    shouldHandlePreCacheList = preCacheList.some(function(path) {
        return pathname.includes(path);
    });
  }
  
  

    // 检查请求是否来自我们想要处理的URL（即 '/js' 或 '/css' 文件夹）
    if (shouldHandlFetchCacheList) {
        // console.log('pathname:',pathname,fetchCacheList)
        event.respondWith(
            caches.match(event.request).then(function(response) {
                // 如果在缓存中找到了资源，就返回缓存中的资源
                if (response) return response;

                // 如果在缓存中找不到资源，就从网络中获取资源，并将其缓存以供后续使用
                return fetch(event.request).then(function(networkResponse) {
                    return caches.open(fetchCachesName).then(function(cache) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }else if(shouldHandlePreCacheList){
        // console.log('event.request:', event.request)
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request)
            })
        )
    }
    

    // 直接返回 Response 对象
    // event.respondWith(new Response('Hello World!'))

    // // 等待 1 秒钟之后异步返回 Response 对象
    // event.respondWith(new Promise(resolve => {
    //     resolve(new Response('Hello World!'))
    // }))
})
