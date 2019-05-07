import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native';

export default class FlexBoxTest extends Component {
    render () {
        return (
            <View style={{flexDirection: 'row', backgroundColor: 'darkgray', marginTop: 20}}>
                <View style={{width: 40, height: 40, backgroundColor: 'darkcyan', margin: 5}}>
                    <Text style={{fontSize: 16,color:'#000'}}>1</Text>
                </View>
                <View style={{width: 40, height: 40, backgroundColor: 'darkcyan', margin: 5}}>
                    <Text style={{fontSize: 16}}>2</Text>
                </View>
                <View style={{width: 40, height: 40, backgroundColor: 'darkcyan', margin: 5}}>
                    <Text style={{fontSize: 16}}>3</Text>
                </View>
                <View style={{width: 40, height: 40, backgroundColor: 'darkcyan', margin: 5}}>
                    <Text style={{fontSize: 16}}>5</Text>
                </View>
            </View>
        )
    }
}