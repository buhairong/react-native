import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'

type Props = {};
class MyPage extends Component<Props> {
  render() {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>MyPage</Text>
          <Button
              title="改变主题色"
              onPress={() => {
                  this.props.onThemeChange('#ff0000')
              }}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
