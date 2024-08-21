import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import Recyclable from "../../assets/recyclable.png";

const ImagePreviewComponent = ({ image, boundingBoxes, selectedBoxes }) => {
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [displayedDimensions, setDisplayedDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  const onContainerLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
    updateDisplayedDimensions(
      width,
      height,
      imageDimensions.width,
      imageDimensions.height
    );
  };

  const onImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    setImageDimensions({ width, height });
    updateDisplayedDimensions(
      containerDimensions.width,
      containerDimensions.height,
      width,
      height
    );
  };

  const updateDisplayedDimensions = (
    containerWidth,
    containerHeight,
    imageWidth,
    imageHeight
  ) => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      imageWidth === 0 ||
      imageHeight === 0
    ) {
      return;
    }

    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = imageWidth / imageHeight;

    let displayWidth, displayHeight;

    if (containerAspectRatio > imageAspectRatio) {
      displayHeight = containerHeight;
      displayWidth = displayHeight * imageAspectRatio;
    } else {
      displayWidth = containerWidth;
      displayHeight = displayWidth / imageAspectRatio;
    }

    setDisplayedDimensions({ width: displayWidth, height: displayHeight });
    console.log(
      `Displayed dimensions: width=${displayWidth}, height=${displayHeight}`
    );
  };

  const calculateBoundingBoxStyle = (boundingBox) => {
    const topLeft = boundingBox.coordinates[0];
    const bottomLeft = boundingBox.coordinates[1];
    const bottomRight = boundingBox.coordinates[2];
    const topRight = boundingBox.coordinates[3];

    const left =
      topLeft.x * displayedDimensions.width +
      (containerDimensions.width - displayedDimensions.width) / 2;
    const top =
      topLeft.y * displayedDimensions.height +
      (containerDimensions.height - displayedDimensions.height) / 2;
    const width = (topRight.x - topLeft.x) * displayedDimensions.width;
    const height = (bottomLeft.y - topLeft.y) * displayedDimensions.height;

    return {
      position: "absolute",
      left,
      top,
      width,
      height,
      borderWidth: 2,
      borderColor: "#BFD9B2",
    };
  };

  const handleBoxPress = (box) => {
    setSelectedBox(box);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} onLayout={onContainerLayout}>
        <ImageBackground
          source={{ uri: image }}
          style={styles.imagePreview}
          resizeMode="contain"
          onLoad={onImageLoad}
        >
          {boundingBoxes.map(
            (box, index) =>
              selectedBoxes.includes(index) && (
                <TouchableOpacity
                  key={index}
                  style={calculateBoundingBoxStyle(box)}
                  onPress={() => handleBoxPress(box)}
                >
                  <Text style={styles.boxLabel}>
                    {box.class} 
                  </Text>
                </TouchableOpacity>
              )
          )}
        </ImageBackground>

        {selectedBox && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View style={styles.informationBar}>
                    <View style={styles.iconContainer}>
                      <Image source={Recyclable} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{selectedBox.class}</Text>
                    </View>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  listContainer: {
    width: "30%",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  imageContainer: {
    position: "relative",
    width: "70%",
    flex: 1,
  },
  imagePreview: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  boxLabel: {
    backgroundColor: "#BFD9B2",
    color: "white",
    padding: 2,
    fontSize: 12,
    position: "absolute",
    top: -18, // Adjust to position the label above the box
    left: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#BFD9B2",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  informationBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    minHeight: 80,
    padding: 20,
    borderRadius: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
    backgroundColor: "#BFD9B2",
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  recycleText: {
    fontWeight: "bold",
    color: "green",
  },
});

export default ImagePreviewComponent;
