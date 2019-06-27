import React, {Component} from 'react';
import {Text, View, Button, TouchableOpacity, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'

export default class PopularItem extends Component {
    render () {
        const {item} = this.props
        if (!item) {
            return null
        }
        let favoriteButton =
            <TouchableOpacity
                style={{padding: 6}}
                onPress={()=>{

                }}
                underlayColor={'transparent'}
            >
                <FontAwesome
                    name={'star-o'}
                    size={26}
                    style={{color:'red'}}
                />
            </TouchableOpacity>
        let description = '<p>' + item.description + '</p>'
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {

                        }}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description
                        }}
                    />
                    <Text style={styles.description}>
                        {item.meta}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Built by:</Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={{height:22, width:22, margin: 2}}
                                    source={{uri:arr[i]}}
                                />
                            })}
                        </View>
                        {favoriteButton}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#ddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5}, // 只对ios有效
        shadowOpacity: 0.4, // 只对ios有效
        shadowRadius: 1, // 只对ios有效
        elevation: 2 // 只对安卓有效
    },
    row: {
        justifyContent: 'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    }
})