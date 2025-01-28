------------------------------------------------------------
-- Sequences
------------------------------------------------------------
CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE case_request_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE case_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE category_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE bookmark_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE file_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE case_deletion_log_id_seq START WITH 1 INCREMENT BY 1;

------------------------------------------------------------
-- Users table
------------------------------------------------------------
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Name VARCHAR2(255) NOT NULL,
    Email VARCHAR2(255) UNIQUE NOT NULL,
    Password VARCHAR2(60) NOT NULL,
    User_Type VARCHAR2(20) CHECK (User_Type IN ('Lawyer', 'LawStudent', 'Admin')) NOT NULL,
    Status VARCHAR2(20) DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive')),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lawyers table
CREATE TABLE Lawyers (
    LawyerID INT PRIMARY KEY,
    Specialization VARCHAR2(255),
    ExperienceYears INT,
    FOREIGN KEY (LawyerID) REFERENCES Users(UserID)
);

-- LawStudents table
CREATE TABLE LawStudents (
    StudentID INT PRIMARY KEY,
    EducationalInstitute VARCHAR2(255),
    FOREIGN KEY (StudentID) REFERENCES Users(UserID)
);

------------------------------------------------------------
-- CaseRequests table
------------------------------------------------------------
CREATE TABLE CaseRequests (
    RequestID INT PRIMARY KEY,
    UserID INT NOT NULL,
    Title VARCHAR2(255) NOT NULL,
    Description CLOB NOT NULL,
    Status VARCHAR2(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    Lawyer VARCHAR2(255),
    RequestedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

------------------------------------------------------------
-- Cases table (with Category column added)
------------------------------------------------------------
CREATE TABLE Cases (
    CaseID INT PRIMARY KEY,
    Title VARCHAR2(255) NOT NULL,
    Description VARCHAR2(1000) NOT NULL,
    Category VARCHAR2(255),
    AddedBy INT NOT NULL,
    DateAdded DATE DEFAULT SYSDATE,
    FOREIGN KEY (AddedBy) REFERENCES Users(UserID)
);

------------------------------------------------------------
-- Bookmarks table
------------------------------------------------------------
CREATE TABLE Bookmarks (
    BookmarkID INT PRIMARY KEY,
    UserID INT NOT NULL,
    CaseID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID)
);

------------------------------------------------------------
-- CaseDeletionLog table
------------------------------------------------------------
DROP TABLE CaseDeletionLog;

-- Create a new table for category deletion logs
CREATE TABLE CaseDeletionLog (
    DeletionLogID INT PRIMARY KEY,
    CaseID INT NOT NULL,
    Category VARCHAR(255) NOT NULL,
    DeletionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

------------------------------------------------------------
-- Files table
------------------------------------------------------------
-- Create the Files table
CREATE TABLE Files (
    FileID INT PRIMARY KEY,
    CaseID INT NOT NULL,
    FileName VARCHAR2(255) NOT NULL,
    FileType VARCHAR2(10),  -- optional, no CHECK constraint
    FileSize NUMBER,        -- optional
    FileData BLOB NOT NULL,
    UploadedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UploadedBy INT NOT NULL,
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID),
    FOREIGN KEY (UploadedBy) REFERENCES Users(UserID)
);

------------------------------------------------------------
-- Indexes (optional)
------------------------------------------------------------
CREATE INDEX idx_cases_addedby ON Cases (AddedBy);
CREATE INDEX idx_cases_assignedto ON Cases (AssignedTo);
CREATE INDEX idx_casecategory_caseid ON CaseCategory (CaseID);
CREATE INDEX idx_casecategory_categoryid ON CaseCategory (CategoryID);


------------------------------------------------------------


-- Create the sequence for auto-incrementing FileID
CREATE SEQUENCE file_id_seq START WITH 1 INCREMENT BY 1;


-- Create a trigger to auto-increment FileID from the sequence
CREATE OR REPLACE TRIGGER trg_file_id
BEFORE INSERT ON Files
FOR EACH ROW
WHEN (new.FileID IS NULL)
BEGIN
  SELECT file_id_seq.NEXTVAL INTO :new.FileID FROM dual;
END;
/

ALTER TABLE Cases MODIFY DateAdded DATE DEFAULT SYSDATE;


CREATE OR REPLACE TRIGGER trg_case_deletion
AFTER DELETE ON Cases
FOR EACH ROW
BEGIN
    INSERT INTO CaseDeletionLog (DeletionLogID, CaseID, Category)
    VALUES (case_deletion_log_id_seq.NEXTVAL, :OLD.CaseID, :OLD.Category);
END;
/

CREATE OR REPLACE TRIGGER trg_lawyer_case_file_deletion
AFTER DELETE ON Users
FOR EACH ROW
BEGIN
    DELETE FROM Files WHERE CaseID IN (SELECT CaseID FROM Cases WHERE AddedBy = :OLD.UserID);
    DELETE FROM Cases WHERE AddedBy = :OLD.UserID;
END;
/

select * from LawStudents;
CREATE OR REPLACE TRIGGER UpdateCaseRequestsLawyerName
AFTER UPDATE OF Name ON Users
FOR EACH ROW
WHEN (OLD.Name != NEW.Name AND NEW.User_Type = 'Lawyer')
BEGIN
  -- Update the Lawyer name in the CaseRequests table
  UPDATE CaseRequests
  SET Lawyer = :NEW.Name
  WHERE Lawyer = :OLD.Name;
END;
/

