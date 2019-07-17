import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme'
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from './popular'
import {onRefreshTrending, onLoadMoreTrending} from './trending'
import {onSearch, onLoadMoreSearch, onSearchCancel} from './search'
import {onLoadFavoriteData} from './favorite'
import {onLoadLanguage} from './language'

export default {
    onThemeChange,
    onRefreshPopular,
    onLoadMorePopular,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrending,
    onLoadFavoriteData,
    onLoadLanguage,
    onShowCustomThemeView,
    onThemeInit,
    onSearch,
    onLoadMoreSearch,
    onSearchCancel
}