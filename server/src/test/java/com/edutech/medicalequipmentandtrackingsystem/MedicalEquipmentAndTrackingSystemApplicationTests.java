package com.edutech.medicalequipmentandtrackingsystem;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.edutech.medicalequipmentandtrackingsystem.dto.LoginRequest;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.*;
import com.edutech.medicalequipmentandtrackingsystem.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional
class MedicalEquipmentAndTrackingSystemApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EquipmentRepository equipmentRepository;

	@Autowired
	private HospitalRepository hospitalRepository;

	@Autowired
	private MaintenanceRepository maintenanceRepository;

	@Autowired
	private OrderRepository orderRepository;

	@BeforeEach
	public void setUp() {
		// Clear the database before each test
		userRepository.deleteAll();
		equipmentRepository.deleteAll();
		hospitalRepository.deleteAll();
		maintenanceRepository.deleteAll();
		orderRepository.deleteAll();
	}

	@Test
	public void testRegisterUser() throws Exception {
		// Create a User object for registration
		User user = new User();
		user.setUsername("testUser");
		user.setPassword("testPassword");
		user.setEmail("test@example.com");
		user.setRole("HOSPITAL");

		// Perform a POST request to the /register endpoint using MockMvc
		mockMvc.perform(post("/api/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(jsonPath("$.username").value(user.getUsername()))
				.andExpect(jsonPath("$.email").value(user.getEmail()))
				.andExpect(jsonPath("$.role").value(user.getRole()));

		// Assert business is created in the database
		User savedUser = userRepository.findAll().get(0);
		assertEquals(user.getUsername(), savedUser.getUsername());
		assertEquals(user.getEmail(), savedUser.getEmail());
		assertEquals(user.getRole(), savedUser.getRole());
	}

	@Test
	public void testLoginUser() throws Exception {
		// Create a user for registration
		User user = new User();
		user.setUsername("testUser");
		user.setPassword("password");
		user.setRole("HOSPITAL");
		user.setEmail("testUser@gmail.com");
		// Register the user
		mockMvc.perform(post("/api/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(user)));

		// Login with the registered user
		LoginRequest loginRequest = new LoginRequest("testUser", "password");

		mockMvc.perform(post("/api/user/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(jsonPath("$.token").exists());
	}

	@Test
	public void testLoginWithWrongUsernameOrPassword() throws Exception {
		// Create a login request with a wrong username
		LoginRequest loginRequest = new LoginRequest("wronguser", "password");

		mockMvc.perform(post("/api/user/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isUnauthorized()); // Expect a 401 Unauthorized response
	}

	@Test
	@WithMockUser(authorities = "HOSPITAL")
	public void testCreateHospital() throws Exception {
		// Create a Hospital object for the test
		Hospital hospital = new Hospital();
		hospital.setName("Test Hospital");
		hospital.setLocation("Test Location");

		// Convert Hospital object to JSON
		String hospitalJson = objectMapper.writeValueAsString(hospital);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(post("/api/hospital/create")
						.contentType(MediaType.APPLICATION_JSON)
						.content(hospitalJson))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.name").value("Test Hospital"))
				.andExpect(jsonPath("$.location").value("Test Location"));

		// Extract the created hospital from the response for further assertions
		Hospital createdHospital = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Hospital.class);

		// Verify the hospital is stored in the database
		Hospital retrievedHospital = hospitalRepository.findById(createdHospital.getId()).orElse(null);
		assertNotNull(retrievedHospital);
		assertEquals(hospital.getName(), retrievedHospital.getName());
		assertEquals(hospital.getLocation(), retrievedHospital.getLocation());
	}

	@Test
	@WithMockUser(authorities = "HOSPITAL")
	public void testAddEquipment() throws Exception {
		// Create a Hospital object for testing
		Hospital hospital = new Hospital();
		hospital.setName("Test Hospital");
		hospital.setLocation("Test Location");

		// Save the hospital to the database
		hospital = hospitalRepository.save(hospital);

		// Create an Equipment object for testing
		Equipment equipment = new Equipment();
		equipment.setName("Test Equipment");
		equipment.setDescription("Test Description");

		// Convert Equipment object to JSON
		String equipmentJson = objectMapper.writeValueAsString(equipment);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(post("/api/hospital/equipment")
						.param("hospitalId", hospital.getId().toString())
						.contentType(MediaType.APPLICATION_JSON)
						.content(equipmentJson))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.name").value("Test Equipment"))
				.andExpect(jsonPath("$.description").value("Test Description"));

		// Extract the added equipment from the response for further assertions
		Equipment addedEquipment = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Equipment.class);

		// Verify the equipment is stored in the database
		Equipment retrievedEquipment = equipmentRepository.findById(addedEquipment.getId()).orElse(null);
		assertNotNull(retrievedEquipment);
		assertEquals("Test Equipment", retrievedEquipment.getName());
		assertEquals("Test Description", retrievedEquipment.getDescription());
		assertEquals(hospital.getId(), retrievedEquipment.getHospital().getId());
		assertEquals(hospital.getName(), retrievedEquipment.getHospital().getName());
		assertEquals(hospital.getLocation(), retrievedEquipment.getHospital().getLocation());
	}


	@Test
	@WithMockUser(authorities = "HOSPITAL")
	public void testScheduleMaintenance() throws Exception {
		// Create an Equipment object for testing
		Equipment equipment = new Equipment();
		equipment.setName("Test Equipment");
		equipment.setDescription("Test Description");

		// Save the equipment to the database
		equipment = equipmentRepository.save(equipment);

		// Create a Maintenance object for testing
		Maintenance maintenance = new Maintenance();
		maintenance.setScheduledDate(new Date());
		maintenance.setDescription("Routine Maintenance");

		// Convert Maintenance object to JSON
		String maintenanceJson = objectMapper.writeValueAsString(maintenance);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(post("/api/hospital/maintenance/schedule")
						.param("equipmentId", equipment.getId().toString())
						.contentType(MediaType.APPLICATION_JSON)
						.content(maintenanceJson))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.scheduledDate").isNotEmpty())
				.andExpect(jsonPath("$.description").value("Routine Maintenance"));

		// Extract the scheduled maintenance from the response for further assertions
		Maintenance scheduledMaintenance = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Maintenance.class);

		// Verify the maintenance is stored in the database
		Maintenance retrievedMaintenance = maintenanceRepository.findById(scheduledMaintenance.getId()).orElse(null);
		assertNotNull(retrievedMaintenance);
		assertEquals("Routine Maintenance", retrievedMaintenance.getDescription());
		assertEquals(equipment.getId(), retrievedMaintenance.getEquipment().getId());
	}

	@Test
	@WithMockUser(authorities = "HOSPITAL")
	public void testPlaceOrder() throws Exception {
		// Create an Equipment object for testing
		Equipment equipment = new Equipment();
		equipment.setName("Test Equipment");
		equipment.setDescription("Test Description");

		// Save the equipment to the database
		equipmentRepository.save(equipment);

		// Create an Order object for testing
		Order order = new Order();
		order.setQuantity(20);

		// Convert Order object to JSON
		String orderJson = objectMapper.writeValueAsString(order);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(post("/api/hospital/order")
						.param("equipmentId", equipment.getId().toString())
						.contentType(MediaType.APPLICATION_JSON)
						.content(orderJson))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.status").isNotEmpty())
				.andExpect(jsonPath("$.quantity").value(20));

		// Extract the placed order from the response for further assertions
		Order placedOrder = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Order.class);

		// Verify the order is stored in the database
		Order retrievedOrder = orderRepository.findById(placedOrder.getId()).orElse(null);
		assertNotNull(retrievedOrder);
		assertNotNull(retrievedOrder.getStatus());
		assertEquals(order.getQuantity(), retrievedOrder.getQuantity());
		assertEquals(equipment.getId(), retrievedOrder.getEquipment().getId());
	}

	@Test
	@WithMockUser(authorities = "TECHNICIAN")
	public void testGetAllMaintenance() throws Exception {
		Maintenance maintenance = new Maintenance();
		maintenance.setScheduledDate(new Date());
		maintenance.setDescription("Routine Maintenance");
		maintenance = maintenanceRepository.save(maintenance);

		Maintenance maintenance2 = new Maintenance();
		maintenance2.setScheduledDate(new Date());
		maintenance2.setDescription("Urgent Maintenance");
		maintenance2 = maintenanceRepository.save(maintenance2);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(get("/api/technician/maintenance")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));

		// Extract the list of maintenances from the response for further assertions
		List<Maintenance> maintenances = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), new TypeReference<>() {});

		// You can add further assertions based on the expected data or the actual data retrieved from the database
		assertNotNull(maintenances);
		assertEquals(2, maintenances.size());
	}

	@Test
	@WithMockUser(authorities = "TECHNICIAN")
	public void testUpdateMaintenance() throws Exception {
		// Create a Maintenance object for testing
		Maintenance initialMaintenance = new Maintenance();
		initialMaintenance.setDescription("Initial Maintenance");
		Maintenance savedMaintenance = maintenanceRepository.save(initialMaintenance);

		// Create an updated Maintenance object
		Maintenance updatedMaintenance = new Maintenance();
		updatedMaintenance.setDescription("Updated Maintenance");

		// Convert updated Maintenance object to JSON
		String updatedMaintenanceJson = objectMapper.writeValueAsString(updatedMaintenance);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(put("/api/technician/maintenance/update/{maintenanceId}", savedMaintenance.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(updatedMaintenanceJson))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(savedMaintenance.getId()))
				.andExpect(jsonPath("$.description").value("Updated Maintenance"));

		// Extract the updated maintenance from the response for further assertions
		Maintenance updatedRecord = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Maintenance.class);

		// Verify the maintenance record is updated in the database
		Maintenance retrievedMaintenance = maintenanceRepository.findById(updatedRecord.getId()).orElse(null);
		assertNotNull(retrievedMaintenance);
		assertEquals("Updated Maintenance", retrievedMaintenance.getDescription());
	}

	@Test
	@WithMockUser(authorities = "SUPPLIER")
	public void testGetAllOrders() throws Exception {
		Order order = new Order();
		order.setQuantity(20);
		order = orderRepository.save(order);

		Order order2 = new Order();
		order2.setQuantity(30);
		order2 = orderRepository.save(order2);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(get("/api/supplier/orders")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));

		// Extract the list of orders from the response for further assertions
		List<Order> orders = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), new TypeReference<>() {});

		// You can add further assertions based on the expected data or the actual data retrieved from the database
		assertNotNull(orders);
		assertEquals(orders.size(),  2);
	}

	@Test
	@WithMockUser(authorities = "SUPPLIER")
	public void testUpdateOrderStatus() throws Exception {
		// Create an Order for testing
		Order order = new Order();
		order.setStatus("Pending");

		// Save the order to the database
		order = orderRepository.save(order);

		// Perform the HTTP request
		ResultActions result = mockMvc.perform(put("/api/supplier/order/update/{orderId}", order.getId())
						.param("newStatus", "Shipped")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(order.getId()))
				.andExpect(jsonPath("$.status").value("Shipped"));

		// Extract the updated order from the response for further assertions
		Order updatedOrder = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Order.class);

		// Verify the order is updated in the database
		Order retrievedOrder = orderRepository.findById(updatedOrder.getId()).orElse(null);
		assertNotNull(retrievedOrder);
		assertEquals("Shipped", retrievedOrder.getStatus());
	}

	@Test
	@WithMockUser(authorities = {"TECHNICIAN", "SUPPLIER"})
	public void testTechnicianAndSupplierShouldNotAccessHospitalApi() throws Exception {
		mockMvc.perform(post("/api/hospital/create")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/hospital/equipment")
						.contentType(MediaType.APPLICATION_JSON)
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/hospital/maintenance/schedule")
						.contentType(MediaType.APPLICATION_JSON)
						.content(""))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/hospital/order")
						.contentType(MediaType.APPLICATION_JSON)
						.content(""))
				.andExpect(status().isForbidden());
	}

	@Test
	@WithMockUser(authorities = {"HOSPITAL", "SUPPLIER"})
	public void testHospitalAndSupplierShouldNotAccessTechnicianApi() throws Exception {
		mockMvc.perform(get("/api/technician/maintenance")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/technician/maintenance/update/{maintenanceId}", 1)
						.contentType(MediaType.APPLICATION_JSON)
						.content(""))
				.andExpect(status().isForbidden());
	}

	@Test
	@WithMockUser(authorities = {"HOSPITAL", "TECHNICIAN"})
	public void testHospitalAndTechnicianShouldNotAccessSupplierApi() throws Exception {
		mockMvc.perform(get("/api/supplier/orders")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/supplier/order/update/{orderId}", 1)
						.contentType(MediaType.APPLICATION_JSON)
						.content(""))
				.andExpect(status().isForbidden());
	}
}
