import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import TouchableScale from 'react-native-touchable-scale';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default class PropertyType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            types: [
                {
                    'name': 'Appartement',
                    'image': 'https://www.vanupied.com/wp-content/uploads/68550354.jpg'
                },
                {
                    'name': 'Piece',
                    'image': 'https://www.lemag-arthurimmo.com/lemag-arthurimmo.com/wp-content/uploads/2017/07/pi%C3%A8ce-aveugle-chambre.jpg'
                },
                {
                    'name': 'Chambre Salon',
                    'image': 'https://www.taari.tg/uploads/zoom/zoom_12579.chambre-salon-meuble-a-louer-a-attikoume.3801.jpg'
                },
                {
                    'name': 'Salon et Multiple Chambre',
                    'image': 'https://www.dakimmobilier.com/medias/images/img-20190225-wa0196.jpg'
                },
                {
                    'name': 'Villa',
                    'image': 'https://media.inmobalia.com/imgV1/B98Le8~d7M9k3DegigsNUPSTJTVpHDjNIUWnFEcMEa6XFdbEBfCXtjZrv1kKflFQkZcHpe7bdSH7WUNilacqzQj7TcEcGWprC05NYEDCyBU~Fs4F6LV7OjWyNu7Glv~uaVJ6bfmwjrmbH~6WzMBGUilK7h2lh76J8ugsJeM84TkJlrerUHF4KcZCPHJ6jkge9JWzaOJoVA0kV9RbpgkFBzu4CVfMF6iE~WBEccSKuAXCo1Lj9lCDHUpgaA3BL00EITlo~UIJAuIB~TWlzpvqw62XqocQvY3X~H2K4vuvHzmgFR0k58fpEYyVwRgYIK2afSdG5Luy.jpg'
                },
                {
                    'name': 'Terrain',
                    'image': 'https://www.mavillamoinschere.com/wp-content/uploads/2019/10/terrains_a_vendre2.jpg'
                },
                {
                    'name': 'Bureau',
                    'image': 'https://www.fabioimmobilier.com/uploads/img/annonce/b_2017-11-07_16-38-04_3_art5a01e16ca65cc.jpg'
                }
            ]
        }
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem bottomDivider
            containerStyle={{ margin: 8, borderRadius: 15 }}
            Component={TouchableScale}
            friction={90}
            tension={100}
            activeScale={0.85}
            linearGradientProps={{
                colors: ['#475ebe', '#27a1f6'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}

        >
            <Avatar source={{ uri: item.image }} rounded size={70} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#fff', fontSize: 23 }}>{item.name}</ListItem.Title>
                {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    )

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.keyExtractor}
                    data={this.state.types}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}