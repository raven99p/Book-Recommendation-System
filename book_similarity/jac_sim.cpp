#include <iostream>
#include <fstream>
#include <sstream>
#include <unordered_set>
#include <vector>

double calculateJaccardSimilarity(const std::vector<std::string>& wordTokens1, const std::vector<std::string>& wordTokens2) {
    std::unordered_set<std::string> set1(wordTokens1.begin(), wordTokens1.end());
    std::unordered_set<std::string> set2(wordTokens2.begin(), wordTokens2.end());

    std::unordered_set<std::string> intersection;
    for (const auto& word : set1) {
        if (set2.count(word) > 0) {
            intersection.insert(word);
        }
    }

    std::unordered_set<std::string> unionSet(set1);
    unionSet.insert(set2.begin(), set2.end());

    double jaccardScore = static_cast<double>(intersection.size()) / unionSet.size();
    return jaccardScore;
}

int main() {
    std::ifstream file("book_summaries.csv");  // Replace with your CSV file path
    if (!file.is_open()) {
        std::cerr << "Failed to open the file." << std::endl;
        return 1;
    }

    std::string line;
    std::vector<std::string> isbns;
    std::vector<std::vector<std::string>> summaries;

    // Read the CSV file line by line
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string isbn, summary;

        // Parse the line using comma as the delimiter
        if (std::getline(iss, isbn, ',') && std::getline(iss, summary, ',')) {
            isbns.push_back(isbn);

            std::istringstream summaryIss(summary);
            std::vector<std::string> wordTokens;
            std::string token;

            // Tokenize the summary using whitespace as the delimiter
            while (summaryIss >> token) {
                wordTokens.push_back(token);
            }

            summaries.push_back(wordTokens);
        }
    }

    file.close();

    int counter = 0;

    // Perform Jaccard similarity calculations
    for (size_t i = 0; i < summaries.size(); ++i) {
        for (size_t j = i + 1; j < summaries.size(); ++j) {
            double similarity = calculateJaccardSimilarity(summaries[i], summaries[j]);
            counter = counter + 1;
            std::cout << "Counter " << counter << std::endl;
        }
    }

    return 0;
}