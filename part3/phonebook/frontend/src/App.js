import { useEffect, useState } from "react";
import contactService from "./services/contacts";

import Header from "./components/Header";
import Filter from "./components/Filter";
import ContactForm from "./components/ContactForm";
import Contacts from "./components/Contacts";
import NotFound from "./components/NotFound";
import Notification from "./components/Notification";

const App = () => {
	const [contacts, setContacts] = useState([]);
	const [contactList, setContactList] = useState(contacts);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [notificationMessage, setNotificationMessage] = useState(null);
	const [variant, setVariant] = useState(null);

	const getAllContacts = () => {
		contactService
			.getAll()
			.then((initialNotes) => {
				setContacts(initialNotes);
				setContactList(initialNotes);
			})
			.catch((error) => {
				handleNotification({
					message: "Unable to load contacts",
					type: "error",
				});
			});
	};

	useEffect(() => {
		getAllContacts();
		// eslint-disable-next-line
	}, []);

	const addContact = (event) => {
		event.preventDefault();

		let newIdx = contacts.length - 1;

		const contactObject = {
			name: newName,
			number: newNumber,
			id: contacts[newIdx].id + 1,
		};

		let name = newName.toLowerCase();

		const existing = contacts.find(
			(obj) => obj.name.toLowerCase() === name
		);

		if (!existing) {
			contactService
				.create(contactObject)
				.then(() => {
					getAllContacts();
					handleNotification({
						message: `Added ${contactObject.name}`,
						type: "success",
					});
				})
				.catch((error) => {
					console.log(error);
					handleNotification({
						message: error.response.data.error,
						type: "error",
					});
				});
		} else if (existing) {
			updateContact(existing, contactObject);
		} else {
			handleNotification({
				message: `Cannot add: Information missing for contact ${contactObject.name}`,
				type: "error",
			});
		}
		setNewName("");
		setNewNumber("");
	};

	const updateContact = (existing, contactObject) => {
		const updatedContact = { ...existing, number: contactObject.number };

		if (
			window.confirm(
				`${newName} already exists in the phonebook! Update ${existing.name}'s number?`
			)
		) {
			contactService
				.update(existing.id, updatedContact)

				.then(getAllContacts())
				.catch((error) => {
					alert(
						`the contact '${existing.name}' could not be updated`
					);
				});
			handleNotification({
				message: `Edited ${contactObject.name}'s number`,
				type: "success",
			});
		}
	};

	const handleNewName = (event) => {
		setNewName(event.target.value);
	};

	const handleNewNumber = (event) => {
		setNewNumber(event.target.value);
	};

	const handleSearch = (event) => {
		event.preventDefault();
		setSearchQuery(event.target.value);

		let name = event.target.value.toLowerCase();

		const exists = contacts.filter((obj) =>
			obj.name.toLowerCase().includes(name)
		);

		setContactList(exists);
	};

	const handleRemoveContact = (id) => {
		const contact = contacts.find((contact) => contact.id === id);

		if (window.confirm(`Delete ${contact.name}?`)) {
			contactService
				.deleteOne(id, contact)
				.then(getAllContacts())
				.catch((error) => {
					handleNotification({
						message: `the contact '${contact.name}' was already removed from server`,
						type: "error",
					});
				});
			handleNotification({
				message: `Deleted ${contact.name}`,
				type: "success",
			});
		}
	};

	const handleNotification = (event) => {
		setNotificationMessage(event.message);
		setVariant(event.type);
		setTimeout(() => {
			setNotificationMessage(null);
			setVariant(null);
		}, 5000);
	};

	return (
		<div>
			<Header title="Phonebook" />

			<Notification message={notificationMessage} variant={variant} />

			<Filter handleSearch={handleSearch} searchQuery={searchQuery} />

			<Header title="Add a new contact" />

			<ContactForm
				addContact={addContact}
				handleNewName={handleNewName}
				handleNewNumber={handleNewNumber}
				newName={newName}
				newNumber={newNumber}
			/>

			<Header title="Numbers" />

			{contactList.length > 0 ? (
				<Contacts
					contactList={contactList}
					handleRemoveContact={handleRemoveContact}
				/>
			) : (
				<NotFound />
			)}
		</div>
	);
};

export default App;
