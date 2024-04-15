
enum METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}
// type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

class HttpClient {
    private baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(method: METHOD, url: string, body?: object): Promise<T> {
        if(method==METHOD.GET&&body){
            let paramsArray = [];  
            //拼接参数  
            Object.keys(body).forEach(key => paramsArray.push(key + '=' + body[key]))  
            if (url.search(/\?/) === -1) {  
                url += '?' + paramsArray.join('&')  
            } else {  
                url += '&' + paramsArray.join('&')  
            }  
        }
        const response = await fetch(this.baseUrl + url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method==METHOD.GET ? undefined : JSON.stringify(body)
        });
        // console.log('response: ',response)
        if (!response.ok&&response.status !== 200) throw new Error(`HTTP request failed: ${response.status} ${response.statusText}`);

        let res = await response.json();
        if (res.status !== 0) {
            throw new Error('status 错误');
        }

        return res.data;
    }

    get<T> (url: string, params?: object): Promise<T>{
        return this.request<T>(METHOD.GET, url, params);
    }

    post<T>(url: string, body?: object): Promise<T> {
        return this.request<T>(METHOD.POST, url, body);
    }

    put<T>(url: string, body?: object): Promise<T> {
        return this.request<T>(METHOD.PUT, url, body);
    }

    delete<T>(url: string, params?: object): Promise<T> {
        return this.request<T>(METHOD.DELETE, url , params);
    }
}
export const http_api = new HttpClient('/api');
// console.log('http1.get(/v1/drainage/list)')

interface Data {
    studioId:        number;
    courseName:      string;
    studioOrderTime: string;
    teacherName:     string;
    cityName:        string;
    studioName:      string;
    studioLocation:  string;
    studioOrderDate: string;
    useTime:         string;
    lessonId:        number;
    lessonName:      string;
    applyStartTime:  string;
    applyEndTime:    string;
    useStartTime:    string;
    useEndTime:      string;
    mapUrl:          string;
}

async function getQueryScheduleDetailInfo(data: {pageNum: number, pageSize: number}){
    return http_api.get<Data>('/schedule/query/queryScheduleDetailInfo',data)
}
getQueryScheduleDetailInfo({pageNum:1,pageSize:10}).then((data)=>{
    console.log(data)
})

// http_api.get<Data>('/schedule/query/queryScheduleDetailInfo',{"pageNum":1,mm: undefined,"pageSize":10}).then((data)=>{
//     console.log(data);
// })
