import react, { useState, useEffect, isValidElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2)


const getRemaining = (time) => {
  const hours = Math.floor(time / 3600);
  const mins = Math.floor(time / 60) - (hours * 60);
  const secs = time - mins * 60;
  return {hours: formatNumber(hours), mins: formatNumber(mins), secs: formatNumber(secs) }
}


export default function App() {
  
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { hours, mins, secs } = getRemaining(remainingSecs);

  const toggle = () => {
    setIsActive(!isActive);
  }
  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  }

  // useEffect(() => {
  //   if(hours == 1){
  //     console.log("You Have reached One hour get off your phone");
  //   }
  //   if(hours == 2){
  //       console.log("At 2 Hours get Off your phone");
  //     }
  // }, [])

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
      console.log("You Have reached One hour get off your phone");
    }
    if(hours == 2 && mins == 0 && secs == 0){
        console.log("At 2 Hours get Off your phone");
    }
    if(hours == 24 && mins == 0 && secs == 0){
      reset();
  }


    return () => clearInterval(interval);
  }, [isActive, remainingSecs])


  return (
    <View style={styles.container}>
      <StatusBar style="light-content" />
        <Text style={styles.timerText}>{`${hours}:${mins}:${secs}`}</Text>
        <TouchableOpacity onPress={toggle} style={styles.button}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={reset} style={[styles.button, styles.buttonReset]}>
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
  button: { 
    borderWidth: 10,
    borderColor: '#B9AAFF',
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 45, 
    color: '#B9AAFF'
  },
  timerText: {
    color: '#fff',
    fontSize: 90, 
    marginBottom: 20
  }, 
  buttonReset: {
    marginTop: 20, 
    borderColor: '#FF851B',
  },
  buttonTextReset: {
    color: '#FF851B'
  }
});
