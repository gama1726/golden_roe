<?php

declare(strict_types=1);

namespace App\Services;

use Smalot\PdfParser\Parser;
use Throwable;

class PdfTextExtractor
{
    public function __construct(private ?Parser $parser = null)
    {
        $this->parser ??= new Parser;
    }

    public function extractHtmlFromPath(string $absolutePath): ?string
    {
        if ($absolutePath === '' || ! is_file($absolutePath)) {
            return null;
        }

        try {
            $text = $this->parser->parseFile($absolutePath)->getText();
        } catch (Throwable) {
            return null;
        }

        $text = $this->normalizeText($text);
        if ($text === '') {
            return null;
        }

        return $this->textToHtml($text);
    }

    public function textToHtml(string $text): string
    {
        $lines = preg_split("/\R/u", $text) ?: [];
        $blocks = [];
        $paragraph = [];
        $listItems = [];
        $listOrdered = false;

        $flushParagraph = function () use (&$blocks, &$paragraph): void {
            if ($paragraph === []) {
                return;
            }
            $blocks[] = '<p>'.e(implode(' ', $paragraph)).'</p>';
            $paragraph = [];
        };

        $flushList = function () use (&$blocks, &$listItems, &$listOrdered): void {
            if ($listItems === []) {
                return;
            }
            $tag = $listOrdered ? 'ol' : 'ul';
            $items = array_map(fn (string $item): string => '<li>'.e($item).'</li>', $listItems);
            $blocks[] = '<'.$tag.'>'.implode('', $items).'</'.$tag.'>';
            $listItems = [];
            $listOrdered = false;
        };

        foreach ($lines as $rawLine) {
            $line = trim(preg_replace('/\s+/u', ' ', $rawLine) ?? '');
            if ($line === '') {
                $flushList();
                $flushParagraph();

                continue;
            }

            if ($this->isHeading($line)) {
                $flushList();
                $flushParagraph();
                $blocks[] = '<h2>'.e($this->headingText($line)).'</h2>';

                continue;
            }

            if (preg_match('/^(?:[\-\x{2013}\x{2014}\x{2022}\*]|\d+[\.\)])\s+(.+)$/u', $line, $match) === 1) {
                $flushParagraph();
                $ordered = preg_match('/^\d+[\.\)]\s+/u', $line) === 1;
                if ($listItems !== [] && $listOrdered !== $ordered) {
                    $flushList();
                }
                $listOrdered = $ordered;
                $listItems[] = trim($match[1]);

                continue;
            }

            $flushList();
            $paragraph[] = $line;
        }

        $flushList();
        $flushParagraph();

        $html = implode('', $blocks);

        return $html === '' ? '' : $html;
    }

    private function normalizeText(string $text): string
    {
        $text = str_replace("\0", '', $text);
        $text = preg_replace("/[ \t]+/u", ' ', $text) ?? $text;
        $text = preg_replace("/\R{3,}/u", "\n\n", $text) ?? $text;

        return trim($text);
    }

    private function isHeading(string $line): bool
    {
        if (mb_strlen($line) > 80 || mb_strlen($line) < 3) {
            return false;
        }

        if (str_ends_with($line, '.') || str_ends_with($line, ',') || str_ends_with($line, ';')) {
            return false;
        }

        $letters = preg_replace('/[^\p{L}]+/u', '', $line) ?? '';
        if ($letters === '' || mb_strlen($letters) < 3) {
            return false;
        }

        return mb_strtoupper($letters, 'UTF-8') === $letters;
    }

    private function headingText(string $line): string
    {
        if (preg_match('/^\d+[\.\)]\s+(.+)$/u', $line, $match) === 1) {
            return trim($match[1]);
        }

        return $line;
    }
}
