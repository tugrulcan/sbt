/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  ListView,
  Linking
} from 'react-native';
import sampleData from './data.json';
import axios from 'axios';

class Student extends Component {
  render() {
    let studentInfo = this.props.studentInfo;
    return <View>
      <Text>{studentInfo.name} {studentInfo.parentName} {studentInfo.parentPhone} {studentInfo.willUse.toString()} </Text>
    </View>

  }
}

export default class DriversApp extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(sampleData.studentList),
      latitude: null,
      longitude: null,
      error: null,
    };

  }

  componentDidMount() {

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        alert("Did mount! coords: " + position.coords.latitude + " --- " + position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  getRoute = () => {

    let addressDict = new Map();

    for (student of sampleData.studentList) {
      addressDict.set(student.studentID, student.address);
    }
    let wpoints_array = Array.from(addressDict.values());
    let wpoints_query = ""; 
    for (wp of wpoints_array) {
      wpoints_query += wp + "|";
    }
    wpoints_query = wpoints_query.substring(0, wpoints_query.length - 1);

    let origin_coords = this.state.longitude.toString() + ',' + this.state.latitude.toString();
    let destination = 'Muradiye Mah. Manolya Sokak No:234 Yunusemre - Manisa';
    let q_url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin_coords;
    q_url += "&destination=" + destination;
    q_url += "&waypoints=" + wpoints_query;
    q_url += "&optimizeWaypoints=true";
    q_url += "&travelMode=DRIVING";
    q_url += "&key=AIzaSyCOqYI7eM7halH9qb10BmTGbrtrqfgBUw4";

    console.log("QURL!!!!!!!!!QQ!Q!!!: " + encodeURI(q_url) );

    axios.get(encodeURI(q_url))
      .then((response) => {
        console.log("responsejson: "  + JSON.stringify(response) );

        //alert("responseJson: " + JSON.stringify(responseJson));
        let url = 'http://maps.google.com/maps?saddr=' + origin_coords;
        for (let index = 0; index < response.routes[0].waypoint_order.length; index++) {
          let element = response.routes[0].waypoint_order[index];
          let addr = wpoints_array[element];

          if (index === 0)
            url += "&daddr=" + addr;
          else
            url += "+to:" + addr;
        }

        url += "+to:Muradiye Mah. Manolya Sokak No:234 Yunusemre - Manisa&dirflg=d";
        console.log("URL!!!!!!!!!!!!!!!!!!!!!!!!! : " + encodeURI(url));
        Linking.openURL( encodeURI(url));
      });
  };



  render() {
    return (
      <View style={{ flex: 2, paddingTop: 22, paddingLeft: 10 }}>
        <ListView
          automaticallyAdjustContentInsets={false}
          initialListSize={3}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Student studentInfo={rowData}> </Student>}
        />
        <Button onPress={this.getRoute} title="Get Directions" />

      </View>

    );
  }
}

AppRegistry.registerComponent('DriversApp', () => DriversApp);
