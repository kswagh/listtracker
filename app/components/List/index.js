import React from 'react';
import { View, Text, BackHandler, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Add from '../../assets/Images/add.svg'

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            noteCategories: ['A', 'B', 'C']
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                {/* Modal for if counter list or normal list and Note title  */}

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
                        this.state.noteCategories == "" ?
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20, color: '#EBEBEB', fontWeight: 'bold' }}>Add List</Text></View>
                            :
                        <ScrollView>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 20 }}>
                                {
                                    this.state.noteCategories.map((data, index) => (
                                        <TouchableOpacity key={index} style={[{
                                            flexWrap: 'wrap',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5, width: '48%', height: 100, borderRadius: 10, marginTop: 10, marginBottom: 10
                                        }, index % 2 == 0 ? {marginRight: '4%'} : null]}>
                                            <View style={{ padding: 10 }}>
                                                <Text>hi</Text>
                                            </View>
                                            <View style={{ padding: 10 }}>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </ScrollView>

                    }
                    {/* Add Note Button Start */}
                    <TouchableOpacity style={{ position: 'absolute', right: 15, bottom: 15, backgroundColor: '#000000', padding: 10, borderRadius: 20 }}>
                        <Add width="20" height="20" />
                    </TouchableOpacity>
                    {/* Add Note Button Start */}
                </View>
            </View>
        )
    }
}