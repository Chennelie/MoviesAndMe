import React from 'react'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { Container, Content, Form, Item, Label, Input, Button, Text } from 'native-base'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0
    this.totalPages = 0
    this.state = {
      films: [],
      isLoading: false,
      isReady: false
    }
  }

  //Load the fonts to use the Text balises in nativebase
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });
    this.setState({ isReady: true });
  }

  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
          this.page = data.page
          this.totalPages = data.total_pages
          this.setState({
            films: [ ...this.state.films, ...data.results ],
            isLoading: false
          })
      })
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text
  }

  _searchFilms() {
    this.page = 0
    this.totalPages = 0
    this.setState({
      films: [],
    }, () => {
        this._loadFilms()
    })
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <Container style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </Container>
      )
    }
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <Container style={styles.main_container}>
        <Content padder>
          <Form>
            <Item floatingLabel>
              <Label>Titre du film</Label>
              <Input
                style={styles.textinput}
                onChangeText={(text) => this._searchTextInputChanged(text)}
                onSubmitEditing={() => this._searchFilms()}
              />
            </Item>
            <Button primary onPress={() => this._searchFilms()}><Text>Rechercher</Text></Button>
          </Form>
          <FlatList
            data={this.state.films}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <FilmItem film={item}/>}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                if (this.page < this.totalPages) {
                   this._loadFilms()
                }
            }}
          />
          {this._displayLoading()}
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Search
