

export default [
  {
    url: '/api/get',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        data: {
          name: 'vben',
        },
      }
    },
  },
  {
    url: '/api/post',
    method: 'post',
    timeout: 2000,
    response: {
      code: 0,
      data: {
        name: 'vben',
      },
    },
  },
  {
    url: '/api/text',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = ''
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      res.setHeader('Content-Type', 'text/plain')
      res.statusCode = 200
      res.end(`hello, ${reqbody}`)
    },
  },
  {
    url: '/api/schedule/query/queryScheduleInfoList',
    method: 'get',
    response: {
        status: 0,
        data: [
            {
                courseName: '课程1',
                studioOrderTime: '8:00 - 10:00',
                studioName: '直播间1000',
                studioLocation: 'E世界15层东区',
                studioOrderDate: '2019-12-25',
                applyEndTime: '2020-01-12 20:30:00',
                applyStartTime: '2020-01-12 18:30:00',
                scheduleId: 1,
            },
            {
                courseName: '这个课程名字特别长这个课程名字特别长这个课程名字特别长这个课程名字特别长',
                studioOrderTime: '8:00 - 10:00',
                studioName: '直播间1000',
                studioLocation: 'E世界15层东区E世界15层东区E世界15层东区E世界15层东区',
                studioOrderDate: '2019-12-25',
                applyEndTime: '2020-01-12 20:30:00',
                applyStartTime: '2020-01-12 18:30:00',
                scheduleId: 2,
            },
        ],
    },
    }
]