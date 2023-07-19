import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Card from '../Card';
import {ResponseObjectType, Result} from '../../types';
import {Alert} from 'react-native';

export default function Home() {
  const [res, setRes] = useState<ResponseObjectType | {}>({});
  const [resItems, setResItems] = useState<Result[]>([]);
  const [currentCard, setCurrentCard] = useState<Result | undefined>();
  const currentCardRef = useRef<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const apiCall = (url?: string) => {
    console.log('apiCall: ');

    fetch(
      url ?? 'https://cx6bmbl1e3.execute-api.us-east-2.amazonaws.com/venues',
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
        return response.json();
      })
      .then((data: ResponseObjectType) => {
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
        setError(error.message);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);

  const onViewableItemsChanged = useRef(
    (info: {viewableItems: Array<{item: Result}>; changed: Array<any>}) => {
      console.log('onViewableItemsChanged');

      if (info.viewableItems.length > 0) {
        currentCardRef.current = info.viewableItems[0].item;
        setCurrentCard(currentCardRef.current);
        mapRef.current?.animateToRegion({
          latitude: info.viewableItems[0].item.lat,
          longitude: info.viewableItems[0].item.lon,
          latitudeDelta: 0.00122,
          longitudeDelta: 0.0121,
        });
      }
    },
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  return (
    <View style={styles.container}>
      {error && Alert.alert('An error occurred!', error, [{text: 'Okay'}])}

      <View>
        {resItems && (
          <FlatList
            renderItem={({item, index}) => <Card data={item} index={index} />}
            data={resItems}
            horizontal
            keyExtractor={(item: Result) => item?.id?.toString()}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            onEndReachedThreshold={0.8}
            onEndReached={() => apiCall((res as ResponseObjectType)?.next_url)}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {currentCard && (
        <MapView
          ref={mapRef}
          initialRegion={{
            latitude: currentCard.lat,
            longitude: currentCard.lon,
            latitudeDelta: 0.00122,
            longitudeDelta: 0.0121,
          }}
          style={styles.container}>
          {resItems.map((marker: Result, index: number) => (
            <Marker
              key={index}
              coordinate={{latitude: marker.lat, longitude: marker.lon}}
              title={marker.name}
              description={marker.address}
            />
          ))}
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
