import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Card from '../Card';
import {ResponseObjectType} from '../../types';

export default function Home() {
  const [res, setRes] = useState<ResponseObjectType | {}>({});
  const [resItems, setResItems] = useState<Object[]>([]);
  const [currentCard, setCurrentCard] = useState();
  const currentCardRef = useRef();

  const apiCall = (url?: string) => {
    console.log('apiCall: ');

    fetch(
      url ?? 'https://cx6bmbl1e3.execute-api.us-east-2.amazonaws.com/venues',
    )
      .then(response => response.json())
      .then(data => {
        setRes(data);
        if (url) {
          setResItems([...resItems, ...data?.results]);
        } else {
          setResItems([...data?.results]);
          setCurrentCard(data.results[0]);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);
  console.log('response: ', res); //?.results
  // const onViewableItemsChanged = React.useCallback(
  //   ({viewableItems, changed}) => {
  //     console.log('onViewableItemsChanged');
  //     if (viewableItems.length > 0) {
  //       currentCardRef.current = viewableItems[0].item;
  //       setCurrentCard(currentCardRef.current);
  //     }
  //   },
  //   [],
  // );
  const onViewableItemsChanged = React.useRef(({viewableItems, changed}) => {
    console.log('onViewableItemsChanged');

    if (viewableItems.length > 0) {
      currentCardRef.current = viewableItems[0].item;
      setCurrentCard(currentCardRef.current);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  return (
    <View style={styles.container}>
      <View>
        {resItems && ( //res?.results
          <FlatList
            renderItem={item => <Card data={item.item} index={item.index} />}
            data={resItems || []} //res?.results
            horizontal
            keyExtractor={item => {
              // console.log('keyExtractor item: ', item);

              return item?.id?.toString();
            }}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            onEndReachedThreshold={0.8}
            onEndReached={() => apiCall(res?.next_url)}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {currentCard && (
        <MapView
          region={{
            latitude: currentCard.lat,
            longitude: currentCard.lon,
            latitudeDelta: 0.00122,
            longitudeDelta: 0.0121,
          }}
          style={{flex: 1}}>
          {resItems.map(
            (
              marker,
              index, //res.results
            ) => (
              <Marker
                key={index}
                coordinate={{latitude: marker.lat, longitude: marker.lon}}
                title={marker.name}
                description={marker.address}
              />
            ),
          )}
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
