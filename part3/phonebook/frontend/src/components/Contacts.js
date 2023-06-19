import React from "react";

const Contacts = ({ contactList, handleRemoveContact }) => {
	return (
		<ul>
			{contactList.map((contact) => (
				<li key={contact.id}>
					{contact.name} {contact.number}{" "}
					<button onClick={() => handleRemoveContact(contact.id)}>
						remove
					</button>
				</li>
			))}
		</ul>
	);
};

export default Contacts;
