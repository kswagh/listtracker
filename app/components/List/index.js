import React from 'react';
import { View, Text, BackHandler, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import Add from '../../assets/Images/add.svg'
import Bin from '../../assets/Images/bin.svg'
import ListDetails from '../ListDetails';

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

    // componentWillUnmount () {
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
        console.log('listsArr.length' + listsArr.length)
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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
                                    <View style={{ height: 100 }}>
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
                                                onPress={() => { console.log(data.index); this.props.navigation.navigate("ListDetails", { listIndex: data.index }) }}
                                                style={[{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    elevation: 5, width: '48%', height: 100, borderRadius: 10, marginTop: 10, marginBottom: 10, padding: 10
                                                }, index % 2 == 0 ? { marginRight: '4%' } : null]}>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{data.listTitle}</Text>
                                                    <TouchableOpacity style={{ justifyContent: 'center' }}>
                                                        <Bin width={20} height={15} />
                                                    </TouchableOpacity>
                                                </View>
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