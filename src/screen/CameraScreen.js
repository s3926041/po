import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Button from "../component/Button";

export default function CameraScreen({ setFocusedTab }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  const cameraRef = useRef(Camera);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.4,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.4, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setImage(data.uri);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleAnalyze = async () => {
    setLoading(true);

    try {
      if (!image) {
        throw new Error("No image selected");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: image.split("/").pop(), // Extracting the file name from URI
        type: "image/jpeg", // Adjust the file type if necessary
      });
      formData.append("requestId", "knflksnflkdnflkfnklnvl"); // Replace with your actual requestId

      // Replace with your server's IP address and port
      const serverUrl =
        "http://10.246.194.220:8080/api/v1/public/getAnalysedData";

      const response = await fetch(serverUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Analysis result:", data);
      navigation.navigate("Analyze", { imageUri: image, response: data });
    } catch (error) {
      console.error("Error analyzing image:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setFocusedTab("Home");
          navigation.navigate("Home");
        }}
      >
        <AntDesign name="arrowleft" size={30} color="#000" />
      </TouchableOpacity>
      {isFocused && !image ? (
        <CameraViewComponent
          cameraRef={cameraRef}
          facing={facing}
          flash={flash}
        />
      ) : (
        <ImagePreviewComponent image={image} />
      )}
      {loading && <LoadingComponent />}
      <NavigationBar
        isFocused={isFocused}
        image={image}
        takePicture={takePicture}
        pickImage={pickImage}
        setImage={setImage}
        handleAnalyze={handleAnalyze}
      />
    </View>
  );
}

const CameraViewComponent = ({ cameraRef, facing, flash }) => (
  <CameraView
    style={styles.camera}
    type={facing}
    flashMode={flash}
    ref={cameraRef}
  />
);

const ImagePreviewComponent = ({ image }) => (
  <ImageBackground
    source={{ uri: image }}
    resizeMode="contain"
    style={styles.imagePreview}
  />
);

const LoadingComponent = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Analyzing...</Text>
  </View>
);

const NavigationBar = ({
  isFocused,
  image,
  takePicture,
  pickImage,
  setImage,
  handleAnalyze,
}) => (
  <View style={styles.cameraControls}>
    {!image && (
      <>
        <TouchableOpacity
          style={[styles.controlButton, { opacity: 0 }]}
        ></TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={takePicture}>
          <AntDesign name="camera" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={25} color="#000" />
        </TouchableOpacity>
      </>
    )}
    {image && (
      <>
        <TouchableOpacity
          style={[styles.controlButton, { opacity: 0 }]}
        ></TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Button title={"Analyze"} onPress={handleAnalyze} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            setImage(null);
          }}
        >
          <AntDesign name="reload1" size={25} color="#000" />
        </TouchableOpacity>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  cameraControls: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    left: "10%",
    minHeight: 80,
    padding: 20,
    bottom: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  controlButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 50,
    backgroundColor: "#BFD9B2",
    minWidth: 50,
  },
  imagePreview: {
    flex: 1,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
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
});
