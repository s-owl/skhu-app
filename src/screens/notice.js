import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
    View, FlatList, Text, ActivityIndicator, StyleSheet,
    ScrollView, SafeAreaView, Button, Image, TouchableOpacity, RefreshControl, Modal, TextInput, Picker, SectionList
} from 'react-native';
import { CardView, CardItem, BottomModal } from '../components/components';
import { MaterialHeaderButtons } from '../components/headerButtons';
import BuildConfigs from '../config';
import Printer from '../tools/printer';
import DateTools from '../tools/datetools';
//import NoticeApi from '../tools/apis';
import ForestApi from '../tools/apis';
import moment from 'moment';

export default class NoticeScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;

        return {
            title: '공지사항',
        };
    };
    constructor(props) {
        super(props);
        const today = new Date();
        const semester = DateTools.getSemesterCode(today.getMonth() + 1);
        this.state = {
            showSearchModal: false,
            year: today.getFullYear().toString(),
            semester: semester.name,
            semesterCode: semester.code,
            title: '',
            date: '',
            result: [],
            refreshing: false,
            firstLoad: true
        };
    }
    componentDidMount() {
        this.loadSearchResults();
    }
    render() {
        if (this.state.firstLoad) {
            return (
                <View style={{ justifyContent: 'center', padding: 32 }}>
                    <ActivityIndicator size="large" color={BuildConfigs.primaryColor} />
                </View>
            );
        } else {
            return (
                <View>
                    {/* 검색 부분 카드뷰 */}
                    <CardItem style={{}} onPress={() => this.setState({ showSearchModal: true })}
                        style={{ flex: 0, flexDirection: 'row' }} elevate={true}>
                        <Text style={{ flex: 1 }}>
                            {this.state.title} / {this.state.date}
                        </Text>
                        <MaterialIcons name="search" size={20} style={{ flex: 0 }} />
                    </CardItem>

                    {/* 렌더링 */}
                    <FlatList
                        data={this.state.result}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.loadSearchResults}
                                tintColor={BuildConfigs.primaryColor}
                                colors={[BuildConfigs.primaryColor]}
                            />
                        }
                        ListFooterComponent={() => (
                            <CardItem style={{ height: 50 }} />
                        )}
                        renderItem={({ item }) =>
                            <SafeAreaView>
                                <ScrollView>
                                    <View style={{ marginRight: 50, marginLeft: 14, }}>
                                        <CardView style={{ flex: 0, flexDirection: 'row' }} >
                                            <View>
                                                <Text style={{ fontWeight: 'bold' }}>제목 : {item.subject}</Text>
                                                <Text> </Text>
                                                <Text style={{ fontWeight: 'bold' }}>날짜 : 2019.02.16.</Text>
                                                <Text> </Text>
                                                <Text>내용 : </Text>
                                                <Text>노을은 오고 있었다.</Text>
                                                <Text>산너머 갈매 하늘이</Text>
                                                <Text>호수에 가득 담기고</Text>
                                                <Text>아까부터 노을은 오고 있었다.</Text>
                                            </View>
                                        </CardView>
                                    </View>
                                </ScrollView>
                            </SafeAreaView>}
                    />

                    {/* 검색창 */}
                    <BottomModal
                        title='공지사항 검색'
                        visible={this.state.showSearchModal}
                        onRequestClose={() => this.setState({ showSearchModal: false })}
                        buttons={[
                            {
                                label: '취소', onPress: () => {
                                    this.setState({ showSearchModal: false });
                                }
                            },
                            {
                                label: '검색', onPress: () => {
                                    this.setState({ showSearchModal: false });
                                    this.loadSearchResults();
                                }
                            }
                        ]}>
                        <CardItem>
                            <TextInput placeholder={'키워드 검색 (선택)'} style={{ fontSize: 16, padding: 8 }}
                                defaultValue={this.state.title}
                                onChangeText={(text) => this.setState({ title: text })} />
                        </CardItem>
                        <CardItem>
                            <TextInput placeholder={'게시일 검색 (선택 : ex)2019.01.01.)'} style={{ fontSize: 16, padding: 8 }}
                                defaultValue={this.state.date}
                                onChangeText={(text) => this.setState({ date: text })} />
                        </CardItem>
                    </BottomModal>
                </View>
            );
        }
    }

    async loadSearchResults() {
        try {
            this.setState({ refreshing: true });
            const results = await ForestApi.postToSam('/SSE/SSEA1/SSEA104_GetList',
                JSON.stringify({
                    'Haggi': this.state.semesterCode,
                    'Yy': this.state.year,
                    'GwamogParam': this.state.title,
                    'SosogParam': this.state.date,
                }));
            let arr = [];
            if (results.ok) {
                const data = await results.json();
                for (let item of data.DAT) {
                    arr.push({
                        key: `${item.GwamogCd}-${item.Bunban}`,
                        subjectCode: item.GwamogCd,
                        classCode: item.Bunban,
                        subject: item.GwamogKorNm,
                        college: item.GaeseolDaehagNm,
                        depart: item.GaeseolHagbuNm,
                        major: item.GaeseolSosogNm,
                        professor: item.ProfKorNm,
                        professorNo: item.ProfNo,
                        availablity: item.SueobGyehoegYn
                    });
                }
                console.log(arr);
                this.setState({
                    result: arr,
                    refreshing: false,
                    firstLoad: false
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}