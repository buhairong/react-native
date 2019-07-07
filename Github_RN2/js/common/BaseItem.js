import React, {Component} from 'react';
import {Text, View, Button, TouchableOpacity, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'
import PropTypes from 'prop-types'

export default class BaseItem extends Component {
    static propTypes = {
        projectModels: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func,
    }

    constructor (props) {
        super(props)
        this.state = {
            isFavorite: this.props.projectModels.isFavorite
        }
    }

    /*
        牢记：https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle
    *   componentWillReceiveProps在新版React中不能再用了
    */
    static getDerivedStateFromProps (nextProps, prevState) {
        const isFavorite = nextProps.projectModels.isFavorite
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite
            }
        }
        return null
    }

    setFavoriteState (isFavorite) {
        this.props.projectModels.isFavorite = isFavorite
        this.setState({
            isFavorite: isFavorite
        })
    }

    onItemClick () {
        this.props.onSelect(isFavorite => {
            this.setFavoriteState(isFavorite)
        })
    }

    onPressFavorite () {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModels.item, !this.state.isFavorite)
    }

    _favoriteIcon () {
        return <TouchableOpacity
            style={{padding: 6}}
            underlayColor="transparent"
            onPress={() => this.onPressFavorite()}
        >
            <FontAwesome
                name={this.state.isFavorite ? 'star' : 'star-o'}
                size={26}
                style={{color: '#678'}}
            />
        </TouchableOpacity>
    }
}

