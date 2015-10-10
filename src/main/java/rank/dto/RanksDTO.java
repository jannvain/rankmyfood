package rank.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a Rank search request.
 *
 */
public class RanksDTO {

    private long currentPage;
    private long totalPages;
    List<RankDTO> ranks;

    public RanksDTO(long currentPage, long totalPages, List<RankDTO> ranks) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.ranks = ranks;
    }

    public long getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public long getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public List<RankDTO> getRanks() {
        return ranks;
    }

    public void setRanks(List<RankDTO> ranks) {
        this.ranks = ranks;
    }
}
