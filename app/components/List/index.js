import React from 'react';
import { View, Text, BackHandler, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import Add from '../../assets/Images/add.svg'
import Bin from '../../assets/Images/bin.svg'
import UpArrow from '../../assets/Images/up_arrow.svg'
import DownArrow from '../../assets/Images/down_arrow.svg'
import LeftArrow from '../../assets/Images/left_arrow.svg'
import RightArrow from '../../assets/Images/right_arrow.svg'
import Checked from '../../assets/Images/checked.svg'

// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let radio_props = [
    { label: 'With Counter', value: 0 },
    { label: 'Without Counter', value: 1 }
];

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            listsArr: [],
            modalVisible: false,
            listCategoryName: "",
            listTitle: "",
            modalFlag: 0,

            changeListPositionViewVisible: false,
            currentIndex: 0
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)

        this.focusListener = null
        this.focusListenerFlag = false
    }

    handleBackButton = () => {
        if (this.props.navigation.isFocused()) {
            Alert.alert("Hold on!", "Are you sure you want close the app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        }
    }

    async componentDidMount() {
        // await AsyncStorage.removeItem('notesArr')
        // await AsyncStorage.removeItem('listsArr')
        this.focusListener = this.props.navigation.addListener('focus', () => {
            // do something
            if (this.focusListenerFlag) {
                this.loadListsData()
                console.log('In Focus Inside')
            }
            this.focusListenerFlag = true
            console.log('In Focus')
        });

        console.log(this.focusListener)

        this.loadListsData()
    }

    // componentWillUnmount() {
    //     this.focusListener.remove()
    // }

    async loadListsData() {
        let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))

        this.setState({
            listsArr: listsArr == null ? "" : listsArr
        })
    }

    async addCategory() {
        let listsArr = await AsyncStorage.getItem('listsArr') == null ? [] : JSON.parse(await AsyncStorage.getItem('listsArr'))

        let categoryObj = {
            index: listsArr.length,
            listCategoryName: this.state.listCategoryName,
            listTitle: this.state.listTitle,
            notesArr: []
        }

        listsArr.push(categoryObj)

        await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))

        this.setState({
            listsArr,
            listTitle: "",
            modalVisible: false,
            modalFlag: 0,
            listCategoryName: ""
        })
    }

    async deleteList(index) {
        Alert.alert(
            "Alert",
            "Are you sure you want to delete the list?",
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
                            let listsArrNew = []

                            listsArr.splice(index, 1)

                            listsArr.map((data, index) => {
                                let obj = {
                                    index: index,
                                    listCategoryName: data.listCategoryName,
                                    listTitle: data.listTitle,
                                    notesArr: data.notesArr
                                }

                                listsArrNew[index] = obj
                            })

                            await AsyncStorage.setItem('listsArr', JSON.stringify(listsArrNew))

                            this.setState({
                                listsArr: listsArrNew
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

    async changeListPosition(currentIndex) {
        this.setState({ changeListPositionViewVisible: true, currentIndex })
    }

    async changeListPositionLeft() {
        let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))
    
        if (this.state.currentIndex > 0) {
          let objOne = listsArr[this.state.currentIndex]
          let objTwo = listsArr[this.state.currentIndex - 1]

          let tempObjOne = {
            index: this.state.currentIndex - 1,
            listCategoryName: objOne.listCategoryName,
            listTitle: objOne.listTitle,
            notesArr: objOne.notesArr
          }
          
          let tempObjTwo = {
            index: this.state.currentIndex,
            listCategoryName: objTwo.listCategoryName,
            listTitle: objTwo.listTitle,
            notesArr: objTwo.notesArr
          }
    
          listsArr[this.state.currentIndex] = tempObjTwo
    
          listsArr[this.state.currentIndex - 1] = tempObjOne
          
          console.log(listsArr)

          this.setState({listsArr, currentIndex: this.state.currentIndex - 1})
    
          await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))
        }
    }

    async changeListPositionRight() {
        let listsArr = JSON.parse(await AsyncStorage.getItem('listsArr'))

        console.log(listsArr)
    
        if (this.state.currentIndex < (listsArr.length - 1)) {
          let objOne = listsArr[this.state.currentIndex]
          let objTwo = listsArr[this.state.currentIndex + 1]
          
          let tempObjOne = {
            index: this.state.currentIndex + 1,
            listCategoryName: objOne.listCategoryName,
            listTitle: objOne.listTitle,
            notesArr: objOne.notesArr
          }
          
          let tempObjTwo = {
            index: this.state.currentIndex,
            listCategoryName: objTwo.listCategoryName,
            listTitle: objTwo.listTitle,
            notesArr: objTwo.notesArr
          }
    
          listsArr[this.state.currentIndex] = tempObjTwo
    
          listsArr[this.state.currentIndex + 1] = tempObjOne
          
          console.log(listsArr)

          this.setState({listsArr, currentIndex: this.state.currentIndex + 1})
    
          await AsyncStorage.setItem('listsArr', JSON.stringify(listsArr))
        }
    }
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                {
                    this.state.changeListPositionViewVisible ?
                        <View style={{ position: 'absolute', zIndex: 20, width: windowWidth, height: windowHeight }}>
                            <View style={{ position: 'absolute', zIndex: 30, width: windowWidth, height: windowHeight, backgroundColor: '#ffffff', opacity: 0.5 }} />
                            <View style={{ position: 'absolute', zIndex: 40, top: 200, right: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#000000', borderRadius: 10, padding: 10 }} onPress={() => {this.changeListPositionLeft()}}>
                                            {/* onPress={() => { this.changeListPositionUpwards() }} */}
                                            <LeftArrow width="10" height="10" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ backgroundColor: '#000000', borderRadius: 10, padding: 10 }}>
                                        <TouchableOpacity >
                                            {/* onPress={() => { this.changeListPositionUpwards() }} */}
                                            <UpArrow width="10" height="10" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginTop: 10 }}>
                                            {/* onPress={() => { this.changeListPositionDownwrds() }} */}
                                            <DownArrow width="10" height="10" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#000000', borderRadius: 10, padding: 10 }} onPress={() => {this.changeListPositionRight()}}>
                                            {/* onPress={() => { this.changeListPositionUpwards() }} */}
                                            <RightArrow width="10" height="10" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'center', marginTop: 10 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#000000', borderRadius: 10, padding: 10 }} onPress={() => { this.setState({ changeListPositionViewVisible: false }) }}>
                                        <Checked width="10" height="10" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        :
                        null
                }
                {/* Modal for if counter list or normal list and Note title start */}
                <Modal
                    animationIn="slideInUp"
                    avoidKeyboard={true}
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => { this.setState({ modalVisible: false }) }}
                // onModalHide={() => { this.setState({ listTitle: "" }) }}
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
                        {
                            this.state.modalFlag == 0 ?
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' }}>List Type</Text>
                                    {/* To create radio buttons, loop through your array of options */}
                                    {
                                        radio_props.map((obj, i) => (
                                            <RadioButton labelHorizontal={true} key={i} style={[i > 0 ? { marginTop: 5 } : null]}>
                                                <TouchableOpacity onPress={() => { this.setState({ listCategoryName: obj.label }) }} style={{ flexDirection: 'row' }}>
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={this.state.listCategoryName == obj.label && true}
                                                        onPress={() => { this.setState({ listCategoryName: obj.label }) }}
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
                                                        onPress={() => { this.setState({ listCategoryName: obj.label }) }}
                                                        // labelStyle={{ fontSize: 20, color: '#2ecc71' }}
                                                        labelWrapStyle={{}}
                                                    />
                                                </TouchableOpacity>
                                            </RadioButton>

                                        ))
                                    }
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
                                        <TouchableOpacity onPress={() => { this.setState({ modalFlag: 1 }) }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20, marginRight: 5 }}>
                                            <Text style={{ fontSize: 14, color: '#ffffff' }}>Select</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false, listCategoryName: "" }) }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20 }}>
                                            <Text style={{ fontSize: 14, color: '#ffffff' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View style={{ minHeight: 100 }}>
                                        <TextInput style={{ fontSize: 17 }} placeholder="Enter Category Title" multiline={true} onChangeText={(listTitle) => { this.setState({ listTitle }) }} value={this.state.listTitle} />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false, listTitle: "", listCategoryName: "" }) }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20, marginRight: 5 }}>
                                            <Text style={{ fontSize: 14, color: '#ffffff' }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { this.addCategory() }} style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20 }}>
                                            <Text style={{ fontSize: 14, color: '#ffffff' }}>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                    </View>
                </Modal>
                {/* Modal for if counter list or normal list and Note title start */}

                {/* Header Start */}
                <View style={{ paddingTop: 40, paddingRight: 20, paddingBottom: 20, paddingLeft: 20, backgroundColor: '#000000' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#ffffff', textTransform: 'capitalize', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>List Tracker</Text>
                        </View>
                    </View>
                </View>
                {/* Header End */}

                <View style={{ flex: 1 }}>
                    {
                        this.state.listsArr == "" ?
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20, color: '#EBEBEB', fontWeight: 'bold' }}>Add List</Text></View>
                            :
                            <ScrollView>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 20 }}>
                                    {
                                        this.state.listsArr.map((data, index) => (
                                            <TouchableOpacity key={index}
                                                onLongPress={() => { this.changeListPosition(data.index) }}
                                                onPress={() => { this.props.navigation.navigate("ListDetails", { listIndex: data.index }) }}
                                                style={[{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    elevation: 2, width: '48%', height: 100, borderRadius: 10, marginTop: 10, padding: 10,
                                                }, index % 2 == 0 ? { marginRight: '4%' } : null, index == this.state.listsArr.length - 1 ? { marginBottom: 65 } : { marginBottom: 10 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{data.listTitle}</Text>
                                                    <TouchableOpacity onPress={() => { this.deleteList(data.index) }} style={{ justifyContent: 'center' }}>
                                                        <Bin width={20} height={15} />
                                                    </TouchableOpacity>
                                                </View>
                                                {
                                                    data.notesArr != "" ?
                                                        <View style={{ marginTop: 10 }}>
                                                            <Text>1. {data.notesArr[0].noteText.length > 11 ? data.notesArr[0].noteText.substring(0, 11) + '...' : data.notesArr[0].noteText}</Text>
                                                            {
                                                                typeof data.notesArr[1] !== 'undefined' ?
                                                                    <Text>2. {data.notesArr[1].noteText.length > 11 ? data.notesArr[1].noteText.substring(0, 11) + '...' : data.notesArr[1].noteText}</Text>
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                        :
                                                        null
                                                }
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </ScrollView>

                    }
                    {/* Add Note Button Start */}
                    <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }) }} style={{ position: 'absolute', right: 15, bottom: 15, backgroundColor: '#000000', padding: 10, borderRadius: 20 }}>
                        <Add width="20" height="20" />
                    </TouchableOpacity>
                    {/* Add Note Button Start */}
                </View>
            </View>
        )
    }
}