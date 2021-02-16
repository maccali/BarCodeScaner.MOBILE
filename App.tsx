import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Dimensions } from "react-native";

export default function App() {
  const [hasPermission, setHasPermission] = useState<string | null | boolean>(
    null
  );
  const [scanned, setScanned] = useState(false);

  var deviceWidth = Dimensions.get("window").width;
  var deviceHeight = 600;
  var pointSize = 10;

  var pointReader = {
    x: deviceWidth / 2,
    y: deviceHeight / 2,
  };

  var containerImage = {
    width: deviceWidth,
    height: deviceHeight,
    padding: 0,
    margin: 0,
  };

  var circle = {
    top: -(deviceHeight / 2 - pointSize / 2),
    width: pointSize,
    height: pointSize,
    borderRadius: pointSize / 2,
    backgroundColor: scanned ? "green" : "red",
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data, bounds, cornerPoints }: any) => {
    var minY: number = 0;
    var maxY: number = 0;
    var minX: number = 0;
    var maxX: number = 0;

    cornerPoints.map((item: any) => {
      if (item.x > pointReader.x) {
        maxX = maxX + 1;
      } else {
        minX = minX + 1;
      }
      if (item.y > pointReader.y) {
        maxY = maxY + 1;
      } else {
        minY = minY + 1;
      }
    });

    if (maxX == 2 && minX == 2 && maxY == 2 && minY == 2) {
      setScanned(true);
      alert(
        `Código de Barras do tipo ${type} com o dado ${data} foi escaneado!`
      );
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={containerImage}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          {/* <BarCodePointz x={50} y={50} /> */}
        </BarCodeScanner>
      </View>

      {scanned && (
        <Button
          title={"Toque para escanear novamente"}
          onPress={() => setScanned(false)}
        />
      )}

      <View style={circle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
});
