import {instance as axios} from './config.js'

export const api={
  newFeed(tId,fId){
    return axios.get('/:tasid/feeds',{
        params:{
          tasid: tId,
          fedid: fId,
          pravac: 'down'
        }
      }
    )
  },
  postMessage(tId,mess){
    return axios.post('/:tasid/feeds',{
        params:{
          tasid:tId,
          type:'text',
          text:mess,
        }
    }
  )}
}
