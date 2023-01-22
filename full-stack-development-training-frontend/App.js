import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function App() {

	const [text, setText] = React.useState('');
	const [password, setPassword] = React.useState('');

	return (
		<View style={styles.container}>
			<TextInput
				label="Email"
				value={text}
				onChangeText={(newValue) => {
					setText(newValue)
				}}
				style={styles.textBox}
			/>
			<TextInput
				label="Password"
				value={password}
				secureTextEntry={true}
				onChangeText={(newValue) => { 
					setPassword(newValue)
				}}
				style={styles.textBox}
			/>
			<Button
				mode="contained"
				onPress={() => console.log(`Check Button Pressed with parameters:\nEmail: ${text}\nPassword: ${password}`)}
			>
				Check
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textBox:{
		width: '80%',
		height: 30,
	},
});
