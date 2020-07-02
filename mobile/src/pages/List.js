import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";
import {
  Alert,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import SpotList from "../components/SpotList";

import logo from "../assets/logo.png";

export default function List() {
  const [techs, setTechs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user").then(user_id => {
      const socket = socketio("http://192.168.0.31:3333", {
        query: { user_id }
      });

      socket.on("booking_response", booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved ? "APROVADA" : "REJEITADA"
          }`
        );
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("techs").then(storagedTechs => {
      const techsArray = storagedTechs.split(",").map(tech => tech.trim());

      setTechs(techsArray);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: 60
        }}
      >
        <TextInput
          placeholder='Experimente "Node"'
          placeholderTextColor="#444"
          autoCapitalize="words"
          onChangeText={setSearch}
          value={search}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="search" size={24} color="#444" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {
    flex: 1,
    marginHorizontal: 20,
    height: 45,
    borderRadius: 4,
    paddingLeft: 20,
    borderWidth: 2,
    borderColor: "#44444425",
    marginTop: 20
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10
  }
});
