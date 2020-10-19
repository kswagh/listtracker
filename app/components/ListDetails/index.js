import React from 'react';
import { View, Text, BackHandler, TouchableOpacity, TextInput, ScrollView, Alert, StatusBar, Dimensions } from 'react-native';
import CheckBox from 'react-native-check-box'
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import KeepAwake from 'react-native-keep-awake';
import Toast from 'react-native-simple-toast';
import Add from '../../assets/Images/add.svg'
import Bin from '../../assets/Images/bin.svg'
import Minus from '../../assets/Images/minus.svg'
import Edit from '../../assets/Images/edit.svg'
import Refresh from '../../assets/Images/refresh.svg'
import Filter from '../../assets/Images/filter.svg'
import UpArrow from '../../assets/Images/up_arrow.svg'
import DownArrow from '../../assets/Images/down_arrow.svg'
import Checked from '../../assets/Images/checked.svg'
import { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let radio_props = [
  { label: 'Checked', value: 0 },
  { label: 'Unchecked', value: 1 }
];

export default class ListDetails extends React.Component {
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
      editNoteCounter: 0,

      isFilterModalVisible: false,
      filterName: "",

      listTitle: "",
      listCategoryName: "",

      changeListPositionViewVisible: false,
      currentIndex: 0
    }
  }

  componentWillUnmount() {
    this.changeKeepAwake(false)
  }

  async componentDidMount() {
    // await AsyncStorage.removeItem('notesArr')
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))

    console.log(this.props.navigation)

    this.setState({
      notesArr: listsArr[this.props.route.params.listIndex].notesArr,
      listCategoryName: listsArr[this.props.route.params.listIndex].listCategoryName,
      listTitle: listsArr[this.props.route.params.listIndex].listTitle
    })
  }

  changeKeepAwake(shouldBeAwake) {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }

  //function to add a note
  async addNote() {
    try {
      if (this.state.noteText == "") {
        Toast.show('Note cannot be blank!', Toast.LONG);
      } else {
        let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))

        let notesArr = listsArr[this.props.route.params.listIndex].notesArr

        let notesArrObj = {
          checkBoxChecked: false,
          noteText: this.state.noteText,
          counter: 0,
          index: notesArr.length
        }

        notesArr.push(notesArrObj);

        listsArr[this.props.route.params.listIndex].notesArr = notesArr

        await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

        this.setState({
          isAlertModalVisible: false
        })

        this.applyFilter()
      }
    } catch (e) {
      console.log(e)
    }
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
    if (this.state.noteText == "") {
      Toast.show('Note cannot be blank!', Toast.LONG);
    } else {
      let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))

      let notesArr = listsArr[this.props.route.params.listIndex].notesArr

      let notesArrObj = {
        checkBoxChecked: this.state.editNoteCheckBoxChecked,
        noteText: this.state.noteText,
        counter: this.state.editNoteCounter,
        index: this.state.editNoteIndex
      }

      notesArr[this.state.editNoteIndex] = notesArrObj

      listsArr[this.props.route.params.listIndex].notesArr = notesArr

      await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

      this.setState({
        noteText: "",
        isAlertModalVisible: false
      })

      this.applyFilter()
    }
  }

  //Function to change checkbox checked flag
  async changeCheckBoxCheckedFlag(index, checkBoxChecked, counter, noteText) {
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))

    let notesArr = listsArr[this.props.route.params.listIndex].notesArr

    let notesArrObj = {
      checkBoxChecked: checkBoxChecked ? false : true,
      noteText: noteText,
      counter,
      index
    }

    notesArr[index] = notesArrObj

    listsArr[this.props.route.params.listIndex].notesArr = notesArr

    await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

    this.applyFilter()

  }

  //function to delete a note
  async deleteNote(index) {
    Alert.alert(
      "Alert",
      "Are you sure you want to delete the note?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
            let notesArr = listsArr[this.props.route.params.listIndex].notesArr
            let notesArrNew = []

            notesArr.splice(index, 1)

            notesArr.map((data, index) => {
              let obj = {
                checkBoxChecked: data.checkBoxChecked,
                noteText: data.noteText,
                counter: data.counter,
                index
              }
              notesArrNew[index] = obj
            })

            listsArr[this.props.route.params.listIndex].notesArr = notesArrNew

            await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

            this.applyFilter()

          }
        }
      ],
      { cancelable: false }
    );
  }

  //Function to decrease the note counter
  async decreaseCounter(index, checkBoxChecked, counter, noteText) {
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
    let notesArr = listsArr[this.props.route.params.listIndex].notesArr

    let notesArrObj = {
      checkBoxChecked,
      noteText: noteText,
      counter: counter == 0 ? 0 : counter - 1,
      index
    }

    notesArr[index] = notesArrObj

    listsArr[this.props.route.params.listIndex].notesArr = notesArr

    await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

    this.applyFilter()
  }

  //Function to increase the note counter
  async increaseCounter(index, checkBoxChecked, counter, noteText) {
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
    let notesArr = listsArr[this.props.route.params.listIndex].notesArr

    let notesArrObj = {
      checkBoxChecked,
      noteText: noteText,
      counter: counter + 1,
      index
    }

    notesArr[index] = notesArrObj

    listsArr[this.props.route.params.listIndex].notesArr = notesArr

    await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))


    this.applyFilter()
  }

  async refreshList() {
    Alert.alert(
      "Alert",
      "Are you sure you want to refresh the list?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            try {
              let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
              let notesArrOld = listsArr[this.props.route.params.listIndex].notesArr
              let notesArrNew = []
              let newNotesArrObj = Object

              notesArrOld.map((data, index) => {
                newNotesArrObj = {
                  checkBoxChecked: false,
                  noteText: data.noteText,
                  counter: 0,
                  index: data.index
                }
                notesArrNew.push(newNotesArrObj)
              })

              listsArr[this.props.route.params.listIndex].notesArr = notesArrNew

              await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

              this.setState({
                notesArr: notesArrNew,
                filterName: ""
              })
            } catch (e) {
              console.log(e)
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  async applyFilter() {
    try {
      // let notesArrTemp = await AsyncStorage.getItem('notesArr')
      let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
      let notesArr = listsArr[this.props.route.params.listIndex].notesArr
      let notesArrNew = []

      notesArr.forEach(element => {
        if (this.state.filterName == "Checked") {
          if (element.checkBoxChecked) {
            notesArrNew.push(element)
          }
        } else if (this.state.filterName == "Unchecked") {
          if (!element.checkBoxChecked) {
            notesArrNew.push(element)
          }
        } else {
          notesArrNew.push(element)
        }
      });

      this.setState({ notesArr: notesArrNew, isFilterModalVisible: false })
    } catch (e) {
      console.log(e)
    }
  }

  async verifyFilterApplyData() {

    this.setState({ isFilterModalVisible: true })
    // if (this.state.notesArr != "") {
    // } else {
    //   Alert.alert(
    //     "Sorry!",
    //     "No data available to apply filters.",
    //     [
    //       { text: "OK" }
    //     ],
    //     { cancelable: false }
    //   );
    // }
  }

  async removeFilter() {
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
    let notesArr = listsArr[this.props.route.params.listIndex].notesArr

    this.setState({
      notesArr,
      isFilterModalVisible: false,
      filterName: ""
    })

  }

  async changeListTitle() {
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
    listsArr[this.props.route.params.listIndex].listTitle = this.state.listTitle

    await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))
  }

  async changeListPosition(currentIndex) {
    this.setState({ changeListPositionViewVisible: true, currentIndex })
  }

  async changeListPositionDownwrds() {
    let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
    let newNotesArr = []
    let flag = 0
    let noteObj = Object

    // console.log(listsArr[this.props.route.params.listIndex].notesArr)
    if (this.state.currentIndex < (listsArr[this.props.route.params.listIndex].notesArr.length - 1)) {
      listsArr[this.props.route.params.listIndex].notesArr.map((data, indexMain) => {
        if (data.index == this.state.currentIndex) {
          let tempObjOne = {
            checkBoxChecked: data.checkBoxChecked,
            counter: data.counter,
            index: this.state.currentIndex + 1,
            noteText: data.noteText
          }
          noteObj = tempObjOne
          flag = 1
          // console.log(noteObj)
        }

        if (flag == 1) {
          if ((this.state.currentIndex + 1) == data.index) {
            let tempObjTwo = {
              checkBoxChecked: data.checkBoxChecked,
              counter: data.counter,
              index: this.state.currentIndex,
              noteText: data.noteText
            }
            // console.log(noteObj)
            // console.log(tempObjTwo)

            newNotesArr.push(tempObjTwo)
            newNotesArr.push(noteObj)
            this.setState({ currentIndex: data.index })
            flag = 0
          }
        } else {
          newNotesArr.push(data)
        }
      });
      // console.log(newNotesArr)
      listsArr[this.props.route.params.listIndex].notesArr = newNotesArr
      console.log(listsArr[this.props.route.params.listIndex].notesArr)
      console.log(newNotesArr) 

      this.setState({ notesArr: newNotesArr })

      await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {/* Up and Down arrow start */}
        {
          this.state.changeListPositionViewVisible ?
            <View style={{ position: 'absolute', zIndex: 20, width: windowWidth, height: windowHeight }}>
              <View style={{ position: 'absolute', zIndex: 30, width: windowWidth, height: windowHeight, backgroundColor: '#ffffff', opacity: 0.5 }} />
              <View style={{ position: 'absolute', zIndex: 40, top: 200, right: 20, backgroundColor: '#000000', borderRadius: 10, padding: 10 }}>
                <TouchableOpacity onPress={() => { this.changeListPositionUpwards() }}>
                  <UpArrow width="20" height="20" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.changeListPositionDownwrds() }} style={{ marginTop: 10 }}>
                  <DownArrow width="20" height="20" />
                </TouchableOpacity>
              </View>
              <View style={{ position: 'absolute', zIndex: 40, top: 280, right: 20, backgroundColor: '#000000', borderRadius: 10, padding: 10 }}>
                <TouchableOpacity onPress={() => { this.setState({ changeListPositionViewVisible: false }) }}>
                  <Checked width="20" height="20" />
                </TouchableOpacity>
              </View>
            </View>
            :
            null
        }
        {/* Up and Down arrow end */}
        {/* Filter Modal Start */}
        <Modal
          animationIn="slideInUp"
          avoidKeyboard={true}
          isVisible={this.state.isFilterModalVisible}
          onBackdropPress={() => { this.setState({ isFilterModalVisible: false }) }}
        // onModalHide={() => { this.setState({ noteText: "" }) }}
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

            {/* To create radio buttons, loop through your array of options */}
            {
              radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i} style={[i > 0 ? { marginTop: 5 } : null]}>
                  <TouchableOpacity onPress={() => { this.setState({ filterName: obj.label }) }} style={{ flexDirection: 'row' }}>
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.filterName == obj.label && true}
                      onPress={() => { this.setState({ filterName: obj.label }) }}
                      borderWidth={1}
                      // buttonInnerColor={'#e74c3c'}
                      buttonOuterColor={'#000000'}
                      buttonSize={10}
                      buttonOuterSize={20}
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: 10 }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal={true}
                      onPress={() => { this.setState({ filterName: obj.label }) }}
                      // labelStyle={{ fontSize: 20, color: '#2ecc71' }}
                      labelWrapStyle={{}}
                    />
                  </TouchableOpacity>
                </RadioButton>

              ))
            }
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
              <TouchableOpacity onPress={() => { this.applyFilter() }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20, marginRight: 5 }}>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.removeFilter() }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20, marginRight: 5 }}>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>Remove Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setState({ isFilterModalVisible: false, filterName: "" }) }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20 }}>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Filter Modal End */}

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
        <View style={{ paddingTop: 40, paddingRight: 20, paddingBottom: 20, paddingLeft: 20, backgroundColor: '#000000' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ffffff', textTransform: 'capitalize', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>List Tracker</Text>
            </View>
            <TouchableOpacity onPress={() => { this.refreshList() }} style={{ justifyContent: 'center' }}>
              <Refresh width="20" height="20" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Header End */}

        <View style={{ flex: 1, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', paddingBottom: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EBEBEB', marginBottom: 20 }}>
            <TextInput style={{ flex: 1, fontSize: 20, fontWeight: 'bold', marginRight: 10 }} placeholder="Title" multiline={true} onBlur={() => { this.changeListTitle() }} onChangeText={(listTitle) => { this.setState({ listTitle }) }} value={this.state.listTitle} />
            <TouchableOpacity onPress={() => { this.verifyFilterApplyData() }}
              style={{ justifyContent: 'center' }}>
              <Filter width="20" height="20" />
            </TouchableOpacity>
          </View>
          {/* Display Notes View Start */}
          {
            this.state.notesArr == "" ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20, color: '#EBEBEB', fontWeight: 'bold' }}>List Tracker</Text></View>
              :
              <ScrollView>
                {
                  this.state.notesArr.map((data, index) => (
                    <View key={index} style={[{ borderBottomWidth: 1, borderBottomColor: '#EBEBEB', paddingBottom: 10, paddingHorizontal: 20 }, index == this.state.notesArr.length - 1 ? { marginBottom: 45 } : { marginBottom: 10 }]}>
                      <TouchableWithoutFeedback onLongPress={() => { this.state.filterName == "" && this.changeListPosition(data.index) }} onPress={() => { this.changeCheckBoxCheckedFlag(data.index, data.checkBoxChecked, data.counter, data.noteText) }} style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <CheckBox
                          onClick={() => {
                            this.changeCheckBoxCheckedFlag(data.index, data.checkBoxChecked, data.counter, data.noteText)
                          }}
                          isChecked={data.checkBoxChecked}
                        />
                        {/* <CheckBox
                          value={data.checkBoxChecked ? true : false}
                          onValueChange={(newValue) => { this.changeCheckBoxCheckedFlag(data.index, data.checkBoxChecked, data.counter, data.noteText) }}
                        />
                        {
                          console.log(data)
                        } */}
                        <View style={{ flex: 1, justifyContent: 'center', marginRight: 5 }}>
                          <Text style={{ fontSize: 17 }}>{data.noteText}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{ justifyContent: 'center', marginRight: 10 }} onPress={() => { this.setEditNoteParams(data.index, data.checkBoxChecked, data.noteText, data.counter) }}>
                          <Edit color={'#000000'} width="20" height="20" />
                        </TouchableOpacity>
                        {
                          this.state.listCategoryName == "With Counter" ?
                            <View style={{ flexDirection: 'row', marginRight: 15, alignItems: 'center' }}>
                              <TouchableOpacity style={{ width: 25, height: 25, padding: 5, backgroundColor: '#000000', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 5 }} onPress={() => { this.decreaseCounter(data.index, data.checkBoxChecked, data.counter, data.noteText) }}>
                                <Minus width="10" height="10" />
                              </TouchableOpacity>
                              <Text style={[{ fontSize: 17 }, data.counter > 0 ? { color: '#33a249' } : { color: '#000000' }]}>{data.counter}</Text>
                              <TouchableOpacity style={{ width: 25, height: 25, padding: 5, backgroundColor: '#000000', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }} onPress={() => { this.increaseCounter(data.index, data.checkBoxChecked, data.counter, data.noteText) }}>
                                <Add width="10" height="10" />
                              </TouchableOpacity>
                            </View>
                            :
                            null
                        }
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.deleteNote(data.index) }}>
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