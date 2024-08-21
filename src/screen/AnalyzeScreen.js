import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import ImagePreviewComponent from "../component/ImagePreviewComponent";

function AnalyzeScreen({ setFocusedTab }) {
  const [loading, setLoading] = useState(false); // Add loading state
  const [modalVisible, setModalVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, response } = route.params;

  const boundingBoxes = response.data.results.map((result, index) => ({
    id: index,
    class: result.class,
    confidence: result.confidenceRate,
    coordinates: [
      result.boundingBox.topLeftCornerPoint,
      result.boundingBox.bottomLeftCornerPoint,
      result.boundingBox.bottomRightCornerPoint,
      result.boundingBox.topRightCornerPoint,
    ],
  }));

  // Initialize selectedBoxes state with all bounding boxes selected
  useEffect(() => {
    setSelectedBoxes(boundingBoxes.map((box, index) => index));
  }, []);

  const handleBoxPress = (index) => {
    setSelectedBoxes((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleApproval = async (index, box) => {
    const serverUrl = "http://10.246.194.220:8080/api/v1/public/detect";

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        body: JSON.stringify(box),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data:", data);
      setApprovalStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "approved",
      }));


    } catch (error) {
    }
  };

  const handleRejection = async (index, box) => {
    const serverUrl = "http://10.246.194.220:8080/api/v1/public/detect";

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        body: JSON.stringify(box),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data:", data);
      setApprovalStatus((prevStatus) => ({
        ...prevStatus,
        [index]: "rejected",
      }));

    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setFocusedTab("Camera");
          navigation.goBack();
        }}
      >
        <AntDesign name="arrowleft" size={30} color="#000" />
      </TouchableOpacity>
      <ImagePreviewComponent
        image={imageUri}
        boundingBoxes={boundingBoxes}
        selectedBoxes={selectedBoxes}
      />
      {loading && <LoadingComponent />}
      <TouchableOpacity
        style={styles.toggleListButton}
        onPress={() => setListVisible(!listVisible)}
      >
        <Text style={styles.textStyle}>Results</Text>
      </TouchableOpacity>

      {listVisible && (
        <View style={styles.listContainer}>
          <ScrollView>
            {boundingBoxes.map((box, index) => (
              <View key={index} style={styles.listItem}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleBoxPress(index)}
                >
                  {selectedBoxes.includes(index) && (
                    <View style={styles.selectedCircle} />
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    color: selectedBoxes.includes(index) ? "#BFD9B2" : "black",
                    flex: 1,
                  }}
                >
                  {box.class}
                </Text>
                <View style={styles.iconContainer}>
                  {approvalStatus[index] === "approved" ? (
                    <AntDesign name="checkcircle" size={30} color="green" />
                  ) : approvalStatus[index] === "rejected" ? (
                    <AntDesign name="closecircle" size={30} color="red" />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.iconContainerChild}
                        onPress={() => handleApproval(index, box)}
                      >
                        <AntDesign name="checkcircleo" size={30} color="#000" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconContainerChild}
                        onPress={() => handleRejection(index, box)}
                      >
                        <AntDesign name="closecircleo" size={30} color="#000" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const LoadingComponent = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  questionButton: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
  },
  toggleListButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#BFD9B2",
    borderRadius: 20,
    padding: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    position: "absolute",
    bottom: 100,
    width: "80%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#BFD9B2",
  },
  selectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#BFD9B2",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconContainerChild: {
    marginLeft: 10,
  },
});

export default AnalyzeScreen;
