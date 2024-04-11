document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const dogForm = document.getElementById('dog-form');
  
    // Fetch and render dogs on page load
    fetchDogs();
  
    // Handle form submission for editing dogs
    dogForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const formData = new FormData(dogForm);
      const dogId = dogForm.getAttribute('data-dog-id'); // Get dog's ID 
  
      const updateData = {
        name: formData.get('name'),
        breed: formData.get('breed'),
        sex: formData.get('sex')
      };
  
      updateDog(dogId, updateData);
    });
  
    // Function to fetch and render dogs
    function fetchDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
           tableBody.innerHTML = ''; // Reset the table
           dogs.forEach(dog => renderDogRow(dog));
          })
        .catch(error => console.error('Error fetching dogs:', error));
    }
  
    // Function to render a single dog row
    function renderDogRow(dog) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class="edit-btn" data-dog-id="${dog.id}">Edit</button></td>
      `;
      tableBody.appendChild(row);
  
      // Add click listener to edit button
      row.querySelector('.edit-btn').addEventListener('click', () => {
        populateForm(dog);
      });
    }
  
    // Function to edit dog details
    function populateForm(dog) {
      dogForm.elements.name.value = dog.name;
      dogForm.elements.breed.value = dog.breed;
      dogForm.elements.sex.value = dog.sex;
      dogForm.setAttribute('data-dog-id', dog.id); // Store dog ID
    }
  
    // Function to update dog information
    function updateDog(dogId, updateData) {
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update failed');
        }
        fetchDogs(); // Refetch dogs to update the table
        dogForm.reset(); // Clear the form
      })
      .catch(error => console.error('Error updating dog:', error));
    }
  });
  