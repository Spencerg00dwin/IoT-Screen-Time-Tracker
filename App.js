import react, { useState, useEffect, isValidElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import e from 'express';


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
}


const handleHourChange = (hours) => {
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:QzsIV-92:v1/hours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      numHours: hours
    }),
  })
  
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

  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { hours, mins, secs } = getRemaining(remainingSecs);
  // const [prevHour, setPrevHour] = useState(0);
  const [prevSecs, setPrevSecs] = useState(0);
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

    //Original Code for Actual Functionality over an hourly interval range
    // if((hours == 0 && mins == 0 && secs == 1) || (hours > prevHour && mins == 0 && secs == 0)){
    //   if(hours != 0){
    //     setPrevHour(hours - 1);
    //   }
    //   handleHourChange(hours)
    // }

    //Code for Presentation that changes every 2 seconds

    console.log("secs: ", secs);   
    if((secs == 1) || (secs - 2) >= prevSecs){                   
      if(secs > 1){
        setPrevSecs(secs - 2);
        console.log("prevSecs: ", prevSecs);        
      }   

      if(secs == 1){
        handleHourChange(secs);
      }
      else{
        handleHourChange(secs / 2);
        console.log("Secs/2: ", secs/2);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs, prevSecs])

  return (
    <View style={styles.container}> 
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
      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.button, styles.buttonReset]}>
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
    borderColor: 'grey',
    width: screen.width / 2,
    height: screen.width / 2 - 125,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  }
});
 