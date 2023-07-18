import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Card from '../Card';

export default function Home() {
  const [res, setRes] = useState({});
  const [state, setState] = useState({
    markers: [
      {
        region: {
          latitude: 24.860966,
          longitude: 66.990501,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        title: 'abcd',
        description: 'abcdefg',
      },
    ],
    region: {
      latitude: 24.860966,
      longitude: 66.990501,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });
  const [currentCard, setCurrentCard] = useState();
  console.log('currentCard: ', currentCard);

  const onViewableItemsChanged = React.useRef(({viewableItems, changed}) => {
    console.log('Visible items are', viewableItems);
    if (viewableItems.length > 0) {
      setCurrentCard(viewableItems[0]);
    }
    console.log('Changed in this iteration', changed);
  }).current;
  useEffect(() => {
    fetch('https://cx6bmbl1e3.execute-api.us-east-2.amazonaws.com/venues')
      .then(response => response.json())
      .then(data => {
        setRes(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);
  console.log('state: ', state);
  console.log('response: ', res?.results);

  const onRegionChange = () => {};
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80, // Item is considered viewable if 50% of it is visible
  };
  return (
    <View style={styles.container}>
      {/* <Card /> */}
      <View style={{}}>
        {/* height: 200 */}
        {res?.results && (
          <FlatList
            renderItem={item => {
              // console.log('renderItem');

              return <Card data={item.item} index={item.index} />;
            }}
            data={res?.results || []}
            horizontal
            // getItemLayout={(data, index) => {
            //   console.log('getItemgetItem: ', data, index);
            //   return {
            //     length: 200,
            //     offset: 200 * index,
            //     index,
            //   };
            // }} //this.getItemLayout(data, index)
            // initialScrollIndex={3}
            // getItem={(data, index) => {
            //   console.log('dataaa: ', data, index);
            //   return data;
            // }}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        )}
      </View>

      {/* <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: 24.860966,
          longitude: 66.990501,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={state}
        onRegionChange={setState}
      /> */}
      {res?.results && (
        <MapView
          region={{
            latitude: currentCard
              ? currentCard?.item?.lat
              : res?.results[0]?.lat,
            longitude: currentCard
              ? currentCard?.item?.lon
              : res?.results[0]?.lon,
            latitudeDelta: 0.00122,
            longitudeDelta: 0.0121,
            // marker.region
          }} //{state.region}
          style={{flex: 1}}
          // onRegionChange={onRegionChange}
        >
          {res?.results &&
            res?.results.map((marker, index) => {
              // console.log('res arr: ', marker);

              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker?.lat,
                    longitude: marker?.lon,
                    // marker.region
                  }}
                  // coordinate={state.region}
                  title={marker.name}
                  description={marker.address}
                />
              );
            })}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
