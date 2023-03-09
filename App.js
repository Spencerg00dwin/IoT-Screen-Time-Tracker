import react, { useState, useEffect, isValidElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';


const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2)


const getRemaining = (time) => {
  const hours = Math.floor(time / 3600);
  const mins = Math.floor(time / 60) - (hours * 60);
  const secs = time - mins * 60;
  return {hours: formatNumber(hours), mins: formatNumber(mins), secs: formatNumber(secs) }
}

const handleReset = () => {
  
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:QzsIV-92:v1/deleteQueries')
  // .then(res => console.log(res))
}

const handleOneHour = () => {
  
  
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:QzsIV-92:v1/hours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      numHours: 1
    }),
  })
  // .then(res => console.log(res))
}



const handleTwoHour = () => {
  // console.log("It's been two hours man");
}

const handleButton = (isActive, toggle) => {
  if(isActive){
    return (
      <TouchableOpacity onPress={toggle} style={styles.buttonPause}>
          <Text style={styles.buttonPauseText}>Pause</Text>
      </TouchableOpacity>)
      }
    else{
      return (        
      <TouchableOpacity onPress={toggle} style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    )
    }
}

export default function App() {
  
  const [remainingSecs, setRemainingSecs] = useState(3599);
  const [isActive, setIsActive] = useState(false);
  const { hours, mins, secs } = getRemaining(remainingSecs);
  //Modal
  const [modalVisible, setModalVisible] = useState(false);


  const toggle = () => {
    setIsActive(!isActive);
  }
  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
    handleReset();
  }

  useEffect(() => {
    let interval = null;
    if(isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1);
      }, 1000)
    } else if(!isActive && remainingSecs !== 0){
      clearInterval(interval);
    }

    if(hours == 1 && mins == 0 && secs == 0){
      handleOneHour();
    }
    if(hours == 2 && mins == 0 && secs == 0){
      handleTwoHour();
    }
    if(hours == 24 && mins == 0 && secs == 0){
      reset();
  }


    return () => clearInterval(interval);
  }, [isActive, remainingSecs])


  return (
    <View style={styles.container}> 
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.bigModalText}>Are you sure?</Text>

            <Pressable
              style={[styles.button, styles.yesModalButton]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.modalText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.noModalButton]}
              onPress={() => {
                reset();
                setModalVisible(!modalVisible);
              }}
              >
              <Text style={styles.modalText}>Reset</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

      <StatusBar style="light-content" />
        <Text style={styles.timerText}>{`${hours}:${mins}:${secs}`}</Text>
          {handleButton(isActive, toggle)}
      {/* <TouchableOpacity onPress={reset} style={[styles.button, styles.buttonReset]}> */}
      {/* //need to add a call to reset() when the modal button is clicked */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.button, styles.buttonReset]}>
      {/* <TouchableOpacity onPress={reset} style={[styles.button, styles.buttonReset]}> */}
          <Text style={[styles.buttonText, styles.buttonTextReset]}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPause: {
    borderWidth: 10,
    borderColor: '#FFEF00',
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  button: { 
    borderWidth: 10,
    borderColor: '#138808',
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  buttonText: {
    fontSize: 45, 
    color: '#138808'
  },
  buttonPauseText: {
    fontSize: 45, 
    color: '#FFEF00'
  },
  timerText: {
    color: '#fff',
    fontSize: 90, 
    marginBottom: 20
  }, 
  buttonReset: {
    marginTop: 90, 
    borderColor: '#8B0000',
  },
  buttonTextReset: {
    color: '#8B0000'
  },
  //Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bigModalText: {
    // marginBottom: ,
    textAlign: 'center',
    color: '#07121B',
    fontWeight: 900,
    fontSize: 20
  },
  modalText: {
    textAlign: 'center',
    color: '#07121B',
    fontWeight: 700
  },
  noModalButton: {
    borderWidth: 10,
    borderColor: '#8B0000',
    width: screen.width / 2,
    height: screen.width / 2 - 125,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  yesModalButton: {
    borderWidth: 10,
    borderColor: '#138808',
    width: screen.width / 2,
    height: screen.width / 2 - 125,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  }
});
