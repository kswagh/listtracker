import React from 'react';
import { View, Text, BackHandler, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Settings from '../../assets/Images/settings.svg'
import Add from '../../assets/Images/add.svg'
import Bin from '../../assets/Images/bin.svg'
import Minus from '../../assets/Images/minus.svg'
import Edit from '../../assets/Images/edit.svg'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notesArr: [],
      noteText: "",
      isAlertModalVisible: false,
      actionFlag: 1,

      editNoteObj: new Object,
      editNoteIndex: 0,
      editNoteCheckBoxChecked: false,
      editNoteCounter: 0
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  handleBackButton() {
    return true;
  }

  async componentDidMount() {
    
    let notesArr = await AsyncStorage.getItem('notesArr')
    this.setState({
      notesArr: notesArr == null ? [] : JSON.parse(notesArr)
    })
  }

  //function to add a note
  async addNote() {
    let notesArr = this.state.notesArr
    let notesArrObj = {
      checkBoxChecked: false,
      noteText: this.state.noteText,
      counter: 0
    }

    notesArr.push(notesArrObj);

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArr))

    this.setState({
      isAlertModalVisible: false,
      notesArr
    })
  }

  //Function to set state vars before editing
  setEditNoteParams(index, checkBoxChecked, noteText, counter) {
    this.setState({
      isAlertModalVisible: true,
      editNoteIndex: index,
      noteText,
      editNoteCheckBoxChecked: checkBoxChecked,
      editNoteCounter: counter,
      actionFlag: 2
    })
  }

  //Function to edit a note
  async editNote() {
    let notesArr = this.state.notesArr
    let notesArrObj = {
      checkBoxChecked: this.state.editNoteCheckBoxChecked,
      noteText: this.state.noteText,
      counter: this.state.editNoteCounter
    }

    notesArr[this.state.editNoteIndex] = notesArrObj

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArr))

    this.setState({
      notesArr,
      noteText: "",
      isAlertModalVisible: false
    })

  }

  //Function to change checkbox checked flag
  async changeCheckBoxCheckedFlag(index, checkBoxChecked, counter, noteText) {
    let notesArr = this.state.notesArr
    let notesArrObj = {
      checkBoxChecked: checkBoxChecked ? false : true,
      noteText: noteText,
      counter
    }

    notesArr[index] = notesArrObj

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArr))

    this.setState({
      notesArr
    })

  }

  //function to delete a note
  async deleteNote(index) {
    let notesArr = this.state.notesArr

    notesArr.splice(index, 1)

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArr))

    this.setState({
      notesArr
    })
  }

  //Function to decrease the note counter
  async decreaseCounter(index, checkBoxChecked, counter, noteText) {
    let notesArr = this.state.notesArr
    let notesArrObj = {
      checkBoxChecked,
      noteText: noteText,
      counter: counter == 0 ? 0 : counter - 1
    }

    notesArr[index] = notesArrObj

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArr))

    this.setState({
      notesArr
    })

  }

  //Function to increase the note counter
  async increaseCounter(index, checkBoxChecked, counter, noteText) {
    let notesArr = this.state.notesArr
    let notesArrObj = {
      checkBoxChecked,
      noteText: noteText,
      counter: counter + 1
    }

    notesArr[index] = notesArrObj

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArr))

    this.setState({
      notesArr
    })
  }

  async refreshList() {
    let notesArrOld = this.state.notesArr
    let notesArrNew = []
    let newNotesArrObj = Object

    notesArrOld.map((data, index) => {
      newNotesArrObj = {
        checkBoxChecked: false,
        noteText: data.noteText,
        counter: 0
      }
      notesArrNew.push(newNotesArrObj)
    })

    await AsyncStorage.setItem('notesArr', JSON.stringify(notesArrNew))

    this.setState({
      notesArr: notesArrNew
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        {/* Add Note Modal Start */}
        <Modal
          animationIn="slideInUp"
          avoidKeyboard={true}
          isVisible={this.state.isAlertModalVisible}
          onBackdropPress={() => { this.setState({ isAlertModalVisible: false }) }}
          onModalHide={() => { this.setState({ noteText: "" }) }}
        >
          <View style={{
            width: '100%',
            borderRadius: 20,
            padding: 20,
            backgroundColor: '#ffffff',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}>
            <View style={{ height: 100 }}>
              <TextInput style={{ fontSize: 17 }} placeholder="Enter Note" multiline={true} onChangeText={(noteText) => { this.setState({ noteText }) }} value={this.state.noteText} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => { this.setState({ isAlertModalVisible: false }) }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20, marginRight: 5 }}>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>Cancel</Text>
              </TouchableOpacity>
              {
                this.state.actionFlag == 1 ?
                  <TouchableOpacity onPress={() => { this.addNote() }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20 }}>
                    <Text style={{ fontSize: 14, color: '#ffffff' }}>Add</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => { this.editNote() }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20 }}>
                    <Text style={{ fontSize: 14, color: '#ffffff' }}>Confirm</Text>
                  </TouchableOpacity>

              }
            </View>
          </View>
        </Modal>
        {/* Add Note Modal End */}

        {/* Header Start */}
        <View style={{ padding: 20, backgroundColor: '#000000' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ffffff', textTransform: 'capitalize', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>List Tracker</Text>
            </View>
            <TouchableOpacity onPress={() => {this.refreshList()}} style={{ justifyContent: 'center' }}>
              <Settings width="20" height="20" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Header End */}

        <View style={{ flex: 1, padding: 20 }}>
          {/* Display Notes View Start */}
          {
            this.state.notesArr == "" ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20, color: '#EBEBEB', fontWeight: 'bold' }}>List Tracker</Text></View>
              :
              <ScrollView>
                {
                  this.state.notesArr.map((data, index) => (
                    <View key={index} style={[{ borderBottomWidth: 1, borderBottomColor: '#EBEBEB', paddingBottom: 10 }, index == this.state.notesArr.length - 1 ? { marginBottom: 45 } : { marginBottom: 10 }]}>
                      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <CheckBox
                          value={data.checkBoxChecked}
                          onValueChange={(newValue) => { this.changeCheckBoxCheckedFlag(index, data.checkBoxChecked, data.counter, data.noteText) }}
                        />
                        <View style={{ flex: 1, justifyContent: 'center', marginRight: 5 }}>
                          <Text style={{ fontSize: 17 }}>{data.noteText}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{ justifyContent: 'center', marginRight: 10 }} onPress={() => { this.setEditNoteParams(index, data.checkBoxChecked, data.noteText, data.counter) }}>
                          <Edit color={'#000000'} width="20" height="20" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginRight: 15, alignItems: 'center' }}>
                          <TouchableOpacity style={{ width: 25, height: 25, padding: 5, backgroundColor: '#000000', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 5 }} onPress={() => { this.decreaseCounter(index, data.checkBoxChecked, data.counter, data.noteText) }}>
                            <Minus width="10" height="10" />
                          </TouchableOpacity>
                          <Text style={{ fontSize: 17 }}>{data.counter}</Text>
                          <TouchableOpacity style={{ width: 25, height: 25, padding: 5, backgroundColor: '#000000', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }} onPress={() => { this.increaseCounter(index, data.checkBoxChecked, data.counter, data.noteText) }}>
                            <Add width="10" height="10" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.deleteNote(index) }}>
                          <Bin color={'#000000'} width="20" height="20" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                }
              </ScrollView>
          }
          {/* Display Notes View End */}

          {/* Add Note Button Start */}
          <TouchableOpacity onPress={() => { this.setState({ isAlertModalVisible: true, actionFlag: 1 }) }} style={{ position: 'absolute', right: 15, bottom: 15, backgroundColor: '#000000', padding: 10, borderRadius: 20 }}>
            <Add width="20" height="20" />
          </TouchableOpacity>
          {/* Add Note Button Start */}
        </View>
      </View>
    )
  }
}