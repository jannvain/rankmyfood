package rank.dto;

import java.util.List;
import java.util.stream.Collectors;

//import org.apache.log4j.Category;

import rank.models.Category;

/**
 *
 * JSON-serializable DTO containing user data
 *
 */
public class DebugDTO {

    private String name;
    private String description;
    private long size;
    
    public DebugDTO(String name, String description, long size) {
        this.name = name;
        this.description = description;
        this.size = size;
    }

    public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }
    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }    
}
