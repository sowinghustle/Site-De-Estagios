import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Avatar, Image } from 'react-native-elements';
import { useRouter } from 'expo-router';
import styles from './styles';
import logo from '../../assets/images/LogoEstagioWhite.png';

const NavMenu = () => {

  const router = useRouter();
  
  const [usuarioFoto, SetUsuarioFoto] = useState({uri: 'https://randomuser.me/api/portraits/men/36.jpg'})
  
  const [usuario, setUsuario] = useState('Usuariano da Silva');
  const [email, setEmail] = useState('user.silva@fatec.sp.gov.br');

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handlePressIn = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handlePressOut = () => {
    setActiveButton(null);
  };

  const routes = [
    { name: 'Meus Estágios', icon: 'briefcase-clock', route: '/meus-estagios' },
    { name: 'Meus Documentos', icon: 'file', route: '/meus-documentos' },
    { name: 'Empresas Registradas', icon: 'office-building', route: '/empresas-registradas' },
    { name: 'Alunos Registrados', icon: 'account-group', route: '/alunos-registrados' },
    { name: 'Cursos Registrados', icon: 'book-open-variant', route: '/cursos-registrados' },
    { name: 'Minhas Notificações', icon: 'bell', route: '/minhas-notificacoes' },
    { name: 'Configurações', icon: 'cog', route: '/configuracoes' }
  ];

  return (
    <View style={styles.navContainer}>
      
      {/* Header */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {routes.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push({pathname: item.route as any })}
            onPressIn={() => handlePressIn(item.name)}
            onPressOut={handlePressOut}
            style={[
              styles.menuItem,
              activeButton === item.name && styles.menuItemActive
            ]}
          >
            <ListItem containerStyle={styles.menuItem}>
              <Icon name={item.icon} type="material-community" color="white" />
              <ListItem.Content>
                <ListItem.Title style={styles.menuTitle}>{item.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ListItem containerStyle={styles.footerItem} bottomDivider>
          <Avatar
            rounded
            source={usuarioFoto} // Substitua pela foto da API
          />
          <ListItem.Content>
            <ListItem.Title style={styles.footerName}>{usuario}</ListItem.Title>
            <ListItem.Subtitle style={styles.footerEmail}>{email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    </View>
  );
};

export default NavMenu;
