import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, doCallBack, handleData} from '../ActionUtil'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

/*
    发起搜索
*/
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack){
    return dispatch => {
        dispatch({type: Types.SEARCH_REFRESH})
        fetch(genFetchUrl(inputKey))
            .then(response => {
                // 如果任务取消， 则不做任何处理
                return hasCancel(token) ? null : response.json()
            })
            .then(responseData => {
                // 如果任务取消， 则不做任何处理
                if (handleData(token)) {
                    console.log('user cancel')
                    return
                }
                if (!responseData || !responseData.items || responseData.items.length === 0) {
                    dispatch({type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目`})
                    doCallBack(callBack, `没找到关于${inputKey}的项目`)
                    return
                }
                let items = responseData.items
                handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, "", {data: item}, pageSize, favoriteDao, {
                    showBottomButton: !checkKeyIsExist(popularKeys, inputKey),
                    inputKey
                })
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

/*
    刷新收藏状态
*/
export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return dispatch => {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
            dispatch({
                type: Types.FLUSH_POPULAR_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data
            })
        })
    }
}

function genFetchUrl (key) {
    return API_URL + key + QUERY_STR
}

function hasCancel () {
    return false
}
