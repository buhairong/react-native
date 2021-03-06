import {AsyncStorage} from 'react-native'
import ThemeFactory, {ThemeFlags} from "../../res/styles/ThemeFactory"

const THEME_KEY = 'theme_key'

export default class ThemeDao {
    /*
        获取当前主题
    */
    getTheme () {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                if (!result) {
                    this.save(ThemeFlags.Default)
                    result = ThemeFlags.Default
                }
                resolve(ThemeFactory.createTheme(result))
            })
        })
    }

    /*
        保存语言或标签
    */
    save (themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error) => {

        })
    }
}