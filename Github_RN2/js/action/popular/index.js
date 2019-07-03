import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, handleData} from '../ActionUtil'

/*
    获取最热数据的异步action
*/
export function onRefreshPopular(storeName, url, pageSize, favoriteDao){
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular) // 异步action与数据流
            .then(data => {
                handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
            })
            .catch(error => {
                dispatch({type: Types.POPULAR_REFRESH_FAIL, storeName, error})
            })
    }
}

/*
*   加载更多
*/
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
    return dispatch => {
        setTimeout(() => { // 模拟网络请求
            if ((pageIndex - 1)*pageSize >= dataArray.length) { // 已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex
                })
            } else {
                // 本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                _projectModels(dataArray.slice(0, max), favoriteDao, data => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data
                    })
                })
            }
        }, 500)
    }
}