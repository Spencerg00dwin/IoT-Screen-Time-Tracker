import react, { useState, useEffect, isValidElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { axios } from 'axios';

const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2)


const getRemaining = (time) => {
  const hours = Math.floor(time / 3600);
  const mins = Math.floor(time / 60) - (hours * 60);
  const secs = time - mins * 60;
  return {hours: formatNumber(hours), mins: formatNumber(mins), secs: formatNumber(secs) }
}

const handleOneHour = () => {
  // axios.post('', 'oneHour')
}

const handleTwoHour = () => {
  console.log("It's been two hours man");
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

  const toggle = () => {
    setIsActive(!isActive);
  }
  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
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
      <StatusBar style="light-content" />
        <Text style={styles.timerText}>{`${hours}:${mins}:${secs}`}</Text>
          {handleButton(isActive, toggle)}
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
  }
});
