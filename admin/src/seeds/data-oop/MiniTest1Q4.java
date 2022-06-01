import java.util.Scanner;

class MiniTest1Q4 {
    private int bedrooms;
    private int toilets;

    public MiniTest1Q4(int bedrooms, int toilets) {
        this.bedrooms = bedrooms;
        this.toilets = toilets;
    }

    public int getBedrooms() {
        return bedrooms;
    }

    public int getToilets() {
        return toilets;
    }

    public int getTotal() {
        return 2 + bedrooms + toilets;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        MiniTest1Q4 h = new MiniTest1Q4(sc.nextInt(), sc.nextInt());
        System.out.println("My house has " + h.getTotal() + " rooms including " + h.getBedrooms() + " bedrooms and " + h.getToilets() + " toilets.");
    }
}
