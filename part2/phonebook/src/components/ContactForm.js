import React from "react";

const ContactForm = ({
	addContact,
	handleNewName,
	handleNewNumber,
	newName,
	newNumber,
}) => {
	return (
		<form onSubmit={addContact}>
			<div>
				name: <input value={newName} onChange={handleNewName} />
				number: <input value={newNumber} onChange={handleNewNumber} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

export default ContactForm;
