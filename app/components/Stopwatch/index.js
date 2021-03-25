import React from 'react'
import { View, Text, TouchableOpacity, Vibration, BackHandler } from 'react-native'
import { Picker } from '@react-native-community/picker'
import Back from '../../assets/Images/back.svg'

const PATTERN = [
    1 * 0,
    1 * 400,
    1 * 200,
    1 * 400
];

export default class Stopwatch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            interval: "0",
            timerHasStartedFlag: false,
            seconds: 0,
            minutes: 0,
            hours: 0,
            isStopwatchActive: false
        }

        this.timerIntervalFuncRef = null
    }

    backAction = async () => {
        await this.clearComponentState()
        this.props.navigation.goBack()
    }

    clearComponentState() {
        return new Promise((resolve) => {
            clearInterval(this.timerIntervalFuncRef)

            this.setState({
                interval: "0",
                timerHasStartedFlag: false,
                seconds: 0,
                minutes: 0,
                hours: 0,
                isStopwatchActive: false
            })

            resolve(1)
        })
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    componentWillUnmount() {
        console.log('In componentWillUnmount')
    }

    startStopStopwatch() {
        if (this.state.isStopwatchActive) {
            this.setState({ isStopwatchActive: false })

            clearInterval(this.timerIntervalFuncRef)
        } else {
            this.setState({
                isStopwatchActive: true
            })

            this.timerIntervalFuncRef = setInterval(async () => {
                this.setState({
                    seconds: this.state.seconds + 1
                })

                if (this.state.seconds == 59) {

                    if (this.state.minutes == 59) {
                        this.setState({
                            seconds: 0,
                            minutes: 0,
                            hours: 1
                        })
                    } else {
                        let changeMinutesPromise = await this.changeMinutes()

                        if (changeMinutesPromise == 1) {
                            if (parseInt(this.state.interval) == this.state.minutes || this.state.minutes % parseInt(this.state.interval) == 0) {
                                Vibration.vibrate(PATTERN, true)

                                setTimeout(() => {
                                    Vibration.cancel()
                                }, 1000);
                            }
                        }
                    }
                }
            }, 1000)
        }

        this.setState({ timerHasStartedFlag: true })
    }

    changeMinutes() {
        return new Promise((resolve, reject) => {
            this.setState({
                seconds: 0,
                minutes: this.state.minutes + 1
            })

            resolve(1)
        })
    }

    resetStopwatch() {
        clearInterval(this.timerIntervalFuncRef)

        this.setState({
            isStopwatchActive: false,
            seconds: 0,
            minutes: 0,
            hours: 0
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                {/* Header Start */}
                <View style={{ paddingTop: 40, paddingRight: 20, paddingBottom: 20, paddingLeft: 20, backgroundColor: '#000000' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={async () => {
                                await this.clearComponentState()
                                this.props.navigation.goBack()
                        }} style={{ justifyContent: 'center' }}>
                            <Back width="30" height="30" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#ffffff', textTransform: 'capitalize', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>List Tracker</Text>
                        </View>
                    </View>
                </View>
                {/* Header End */}
                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Select Interval (In Mins)</Text>
                    <Picker
                        selectedValue={this.state.interval}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ interval: itemValue })
                        }>
                        <Picker.Item label="0" value="0" />
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                        <Picker.Item label="7" value="7" />
                        <Picker.Item label="8" value="8" />
                        <Picker.Item label="9" value="9" />
                        <Picker.Item label="10" value="10" />
                        <Picker.Item label="11" value="11" />
                        <Picker.Item label="12" value="12" />
                        <Picker.Item label="13" value="13" />
                        <Picker.Item label="14" value="14" />
                        <Picker.Item label="15" value="15" />
                        <Picker.Item label="16" value="16" />
                        <Picker.Item label="17" value="17" />
                        <Picker.Item label="18" value="18" />
                        <Picker.Item label="19" value="19" />
                        <Picker.Item label="20" value="20" />
                        <Picker.Item label="21" value="21" />
                        <Picker.Item label="22" value="22" />
                        <Picker.Item label="23" value="23" />
                        <Picker.Item label="24" value="24" />
                        <Picker.Item label="25" value="25" />
                        <Picker.Item label="26" value="26" />
                        <Picker.Item label="27" value="27" />
                        <Picker.Item label="28" value="28" />
                        <Picker.Item label="29" value="29" />
                        <Picker.Item label="30" value="30" />
                    </Picker>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 50 }}>
                        {
                            (this.state.hours < 10 ? '0' + this.state.hours : this.state.hours) + ':' +
                            (this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes) + ':' +
                            (this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds)
                        }</Text>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    {
                        !this.state.isStopwatchActive ?
                            <TouchableOpacity onPress={() => { this.startStopStopwatch() }} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#000000', borderRadius: 15, alignItems: 'center' }}>
                                <Text style={{ color: '#ffffff' }}>Start</Text>
                            </TouchableOpacity>
                            :
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { this.startStopStopwatch() }} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#000000', borderRadius: 15, alignItems: 'center', marginRight: 30 }}>
                                    <Text style={{ color: '#ffffff' }}>Stop</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.resetStopwatch() }} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#000000', borderRadius: 15, alignItems: 'center', marginRight: 30 }}>
                                    <Text style={{ color: '#ffffff' }}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            </View>
        )
    }
}