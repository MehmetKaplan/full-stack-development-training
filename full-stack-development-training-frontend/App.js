import * as React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import fetchLean from 'fetch-lean';

export default function App() {

	const [text, setText] = React.useState('');
	const [password, setPassword] = React.useState('');

	const submitLoginRequest = async () => {
		console.log(`Check Button Pressed with parameters:\nEmail: ${text}\nPassword: ${password}`);
		const dataToPost = {
			email: text,
			password: password,
		}
		let backendHost = (Platform.OS === 'android') ? '10.0.2.2' : 'localhost';
		let postResp = await fetchLean('POST', `http://${backendHost}:8080/loginViaEmail`, {}, dataToPost, false);
		console.log(`postResp:\n${JSON.stringify(postResp, null, 2)}`, true);
	}

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
				onPress={submitLoginRequest}
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
		height: 50,
		paddingVertical: 5,
		paddingBottom: 10,
	},
});
