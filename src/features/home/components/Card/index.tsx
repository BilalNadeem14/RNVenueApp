import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Card = props => {
  //   console.log('data: ', props.data, props.index);

  return (
    <View style={styles.cardContainer}>
      <Text>Card {props.index}</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    width: 300,
    marginLeft: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
