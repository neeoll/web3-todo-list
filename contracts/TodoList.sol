// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

contract TodoList {
    event TaskCreated(uint id, bytes32 content, bool status);
    event TaskToggled(uint id, bool completed);
    event ChangesSaved();
    event WriteAccessModified(address addr);
    event ReadAccessModified(address addr);

    uint index;
    uint taskCount;
    bytes32 title;
    address owner;
    bool isPrivate;

    struct Task {
        bytes32 content;
        bool status;
    }

    mapping(address => bool) writeAccess;
    mapping(address => bool) readAccess;
    mapping(uint => Task) tasks;

    constructor(bytes32 _title, address _owner, uint _index, bool _isPrivate) {
        index = _index;
        owner = _owner;
        title = _title;
        isPrivate = _isPrivate;
        writeAccess[owner] = true;
    }

    // State Modifiying (Write) Operations
    function saveChanges(uint[] memory _ids, bytes32[] memory _contents, bool[] memory _statuses) public hasWriteAccess {
        uint temp = 0;
        for (uint i = 0; i < _ids.length; i++) {
            if (_ids[i] >= temp) { temp = _ids[i] + 1; }
            tasks[_ids[i]] = Task(_contents[i], _statuses[i]);
            emit TaskCreated(_ids[i], tasks[_ids[i]].content, tasks[_ids[i]].status);
        }

        if (temp >= taskCount) { taskCount = temp; }
        emit ChangesSaved();
    }

    function toggleCompleted(uint id) public hasWriteAccess {
        tasks[id].status = !tasks[id].status;
        emit TaskToggled(id, tasks[id].status);
    }

    function grantWriteAccess(address addr) public isOwner { 
        writeAccess[addr] = true; 
        if (readAccess[addr] == false) readAccess[addr] = true;
        emit WriteAccessModified(addr);
    }

    function toggleWriteAccess(address addr) public isOwner { 
        writeAccess[addr] = !writeAccess[addr];
        emit WriteAccessModified(addr);
    }

    function grantReadAccess(address addr) public isOwner { 
        readAccess[addr] = true; 
        emit WriteAccessModified(addr);
    }

    function toggleReadAccess(address addr) public isOwner { 
        readAccess[addr] = !readAccess[addr];
        emit WriteAccessModified(addr);
    }

    function togglePrivacy() public isOwner {
        isPrivate = !isPrivate;
    }
    
    
    function transferOwnership(address transferAddr) public isOwner { owner = transferAddr; }

    // Non State-Modifying (Read) Operations
    function getData() public view returns(bytes32[] memory, bool[] memory) { 
        bytes32[] memory _contents = new bytes32[](taskCount);
        bool[] memory _statuses = new bool[](taskCount);

        for (uint i = 0; i < taskCount; i++) {
            _contents[i] = tasks[i].content;
            _statuses[i] = tasks[i].status;
        }

        return(_contents, _statuses); 
    }

    function getIndex() public view returns(uint) { return index; }
    function getTaskCount() public view returns(uint) { return taskCount; }
    function getTitle() public view returns(bytes32) { return title; }
    function getWriteStatus() public view returns(bool) { return writeAccess[msg.sender]; }
    function getReadStatus() public view returns(bool) { 
        if (isPrivate == true) {
            return readAccess[msg.sender]; 
        } else {
            return true;
        }
    }
    function getOwnershipStatus() public view returns(bool) { return (owner == msg.sender); }
    function getPrivacyStatus() public view returns(bool) { return isPrivate; }

    modifier isOwner() {
        require(msg.sender == owner, "This operation is restricted to the owner of the contract");
        _;
    }

    modifier hasWriteAccess() {
        require(writeAccess[msg.sender] == true, "You must have write access to change the contract state");
        _;
    }
}