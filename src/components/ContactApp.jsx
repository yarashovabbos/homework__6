import React, { useState, useEffect } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
// import './ContactApp.css';

const ContactApp = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'male',
    favorite: false,
  });

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (storedContacts) {
      setContacts(storedContacts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleShowModal = (index = null) => {
    if (index !== null) {
      setNewContact(contacts[index]);
      setEditIndex(index);
    } else {
      setNewContact({ firstName: '', lastName: '', phone: '', gender: 'male', favorite: false });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedContacts = contacts.map((contact, index) =>
        index === editIndex ? newContact : contact
      );
      setContacts(updatedContacts);
      toast.success('Kontakt muvaffaqiyatli yangilandi!');
    } else {
      setContacts([...contacts, newContact]);
      toast.success('Kontakt muvaffaqiyatli qo‘shildi!');
    }
    setShowModal(false);
  };

  const handleDelete = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    toast.error(`Kontakt muvaffaqiyatli o'chirildi!`);
  };

  const handleFavoriteToggle = (index) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, favorite: !contact.favorite } : contact
    );
    setContacts(updatedContacts);
  };

  const filterContacts = () => {
    return contacts.filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return (
        fullName.includes(search.toLowerCase()) &&
        (filter === 'all' || contact.gender === filter)
      );
    });
  };

  return (
    <Container>
      <h1 className="my-3">Contact App</h1>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Qidiruv ..." 
          onChange={handleSearchChange}
        />
        <Form.Select onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Form.Select>
        <Button onClick={() => handleShowModal()}>Add Contact</Button>
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>N</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Favorite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterContacts().map((contact, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{contact.firstName}</td>
              <td>{contact.lastName}</td>
              <td>{contact.phone}</td>
              <td>{contact.gender}</td>
              <td onClick={() => handleFavoriteToggle(index)}>
                {contact.favorite ? <FaHeart color="red" /> : <FaRegHeart />}
              </td>
              <td>
                <Button variant="primary" onClick={() => handleShowModal(index)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit Contact' : 'Add Contact'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={newContact.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={newContact.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newContact.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={newContact.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">
              {editIndex !== null ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default ContactApp;
