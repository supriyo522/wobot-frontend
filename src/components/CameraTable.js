import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import './CameraTable.css'; 
import CircleIcon from '@mui/icons-material/Circle'; 
import CloudIcon from '@mui/icons-material/Cloud'; 
import DevicesIcon from '@mui/icons-material/Devices'; 
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { green, red } from '@mui/material/colors'; 

const CameraTable = () => {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [camerasPerPage] = useState(10);

  useEffect(() => {
    fetchCameraData();
  }, []);

  const fetchCameraData = async () => {
    try {
      const response = await axios.get('https://api-app-staging.wobot.ai/app/v1/fetch/cameras', {
        headers: {
          Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy`
        }
      });
      setCameras(response.data.data); 
      setFilteredCameras(response.data.data);
    } catch (error) {
      console.error('Error fetching camera data', error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put('https://api-app-staging.wobot.ai/app/v1/update/camera/status',
        { id, status: newStatus },
        {
          headers: {
            Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy`
          }
        }
      );
      fetchCameraData(); 
    } catch (error) {
      console.error('Error updating status', error);
    }
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = cameras.filter(camera =>
      camera.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCameras(filtered);
  };


  const handleFilter = (e) => {
    setStatusFilter(e.target.value);
    if (e.target.value === '') {
    
      setFilteredCameras(cameras);
    } else {
      const filtered = cameras.filter(camera =>
        camera.status.toLowerCase() === e.target.value.toLowerCase()
      );
      setFilteredCameras(filtered);
    }
  };
  

  
  const indexOfLastCamera = currentPage * camerasPerPage;
  const indexOfFirstCamera = indexOfLastCamera - camerasPerPage;
  const currentCameras = filteredCameras.slice(indexOfFirstCamera, indexOfLastCamera);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="camera-table-container">
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={statusFilter} onChange={handleFilter}>
          <option value="">Filter by status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Health</th>
            <th>Location</th>
            <th>Recorder</th>
            <th>Tasks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCameras.map(camera => (
            <tr key={camera.id}>
             
              <td>
                <CircleIcon 
                  style={{ color: camera.current_status === 'Online' ? green[500] : red[500] }} 
                />
                {camera.name}
              </td>

             
              <td>
                {camera.health ? (
                  <>
        
                    <div>
                      <CloudIcon />
                      <CircleIcon 
                        style={{ color: camera.health.cloud === 'A' ? green[500] : red[500] }}
                      />{' '}
                      {camera.health.cloud ? `Cloud: ${camera.health.cloud}` : 'No Cloud Info'}
                    </div>

                    <div>
                      <DevicesIcon />
                      <CircleIcon 
                        style={{ color: camera.health.device === 'A' ? green[500] : red[500] }}
                      />{' '}
                      {camera.health.device ? `Device: ${camera.health.device}` : 'No Device Info'}
                    </div>
                  </>
                ) : 'No Health Info'}
              </td>

  
              <td>{camera.location || 'N/A'}</td>

      
              <td>{camera.recorder ? camera.recorder : 'N/A'}</td>

              <td>{camera.tasks}</td>

          
              <td>
                <span 
                  style={{ color: camera.status === 'Active' ? green[500] : red[500] }}
                >
                  {camera.status}
                </span>
              </td>

          
              <td>
                <button onClick={() => toggleStatus(camera.id, camera.status)}>
                  <PowerSettingsNewIcon 
                    style={{ color: camera.status === 'Active' ? green[500] : red[500] }} 
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        camerasPerPage={camerasPerPage}
        totalCameras={filteredCameras.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default CameraTable;
